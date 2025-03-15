import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const UserProfile = ({ userData, isOwnProfile = false }) => {
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || !userData || !userData.uid) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', userData.uid));
        const userDocData = userDoc.data();
        
        if (userDocData) {
          setFollowerCount(userDocData.followers?.length || 0);
          setFollowingCount(userDocData.following?.length || 0);
          setIsFollowing(userDocData.followers?.includes(currentUser.uid) || false);
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    checkFollowStatus();
  }, [currentUser, userData]);

  const handleFollow = async () => {
    if (!currentUser || !userData || !userData.uid) return;

    const currentUserRef = doc(db, 'users', currentUser.uid);
    const targetUserRef = doc(db, 'users', userData.uid);

    try {
      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(userData.uid)
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid)
        });
        setFollowerCount(prev => prev - 1);
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(userData.uid)
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid)
        });
        setFollowerCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      alert('Failed to update follow status');
    }
  };

  if (!userData || !userData.uid) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">@{userData.username || 'Loading...'}</h2>
            <p className="text-gray-400">{userData.email || ''}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-300">
                <span className="font-bold text-blue-400">{followerCount}</span> followers
              </span>
              <span className="text-gray-300">
                <span className="font-bold text-blue-400">{followingCount}</span> following
              </span>
            </div>
          </div>
        </div>
        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              isFollowing 
                ? 'bg-gray-600 hover:bg-red-500 hover:text-white text-gray-300'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills Section */}
        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
            <span className="mr-2">🛠</span>
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {userData.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {skill}
              </span>
            )) || <span className="text-gray-400">No skills listed</span>}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Experience
          </h3>
          <p className="text-gray-300">
            {userData.experience || "No experience listed"}
          </p>
        </div>

        {/* Availability Section */}
        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
          <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
            <span className="mr-2">⏳</span>
            Availability
          </h3>
          <p className="text-gray-300">
            {userData.availability || "No availability listed"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 