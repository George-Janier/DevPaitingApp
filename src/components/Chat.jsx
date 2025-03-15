import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, orderBy, addDoc, onSnapshot, getDocs } from 'firebase/firestore';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const currentUser = auth.currentUser;

  // Fetch conversations (users who follow each other)
  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      const userRef = collection(db, 'users');
      const userDoc = await getDocs(query(userRef, where('followers', 'array-contains', currentUser.uid)));
      
      const mutualFollows = [];
      for (const doc of userDoc.docs) {
        const userData = doc.data();
        if (userData.following && userData.following.includes(currentUser.uid)) {
          mutualFollows.push({ ...userData, uid: doc.id });
        }
      }
      setConversations(mutualFollows);
    };

    fetchConversations();
  }, [currentUser]);

  // Listen to messages in real-time
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    try {
      const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
      
      // Create the messages collection for this chat
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await addDoc(messagesRef, {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        timestamp: new Date().toISOString(),
        senderName: currentUser.displayName || currentUser.email // Optional: add sender info
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4 h-[80vh]">
          {/* Conversations List */}
          <div className="col-span-1 bg-gray-800 rounded-xl p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Conversations</h2>
            {conversations.map((user) => (
              <div
                key={user.uid}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg mb-2 cursor-pointer ${
                  selectedUser?.uid === user.uid ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">@{user.username}</div>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="col-span-3 bg-gray-800 rounded-xl p-4 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h3 className="text-xl font-bold">@{selectedUser.username}</h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === currentUser.uid
                            ? 'bg-blue-500'
                            : 'bg-gray-700'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;