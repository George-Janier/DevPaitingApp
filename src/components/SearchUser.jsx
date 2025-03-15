import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { motion } from "framer-motion";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (username.trim() === "") return;

    try {
      const q = query(collection(db, "users"), where("username", "==", username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("");
        setUserData(querySnapshot.docs[0].data());
      } else {
        setError("User not found!");
        setUserData(null);
      }
    } catch (err) {
      setError("Error searching user");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Search Header */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            🔍 Search Developers
          </h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-700 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder-gray-400"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 flex items-center"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 p-3 rounded-xl border border-red-500/30 text-red-300"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* User Card */}
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-400/50 transition-colors shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-400/20 p-3 rounded-full">
                👩💻
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">@{userData.username}</h3>
                
                <div className="mt-4 space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">🛠</span>
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {userData.skills?.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-blue-400/10 px-2 py-1 rounded-md text-sm text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">📈</span>
                    <span className="font-medium">Experience:</span>
                    <span>{userData.experience}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-green-400">⏳</span>
                    <span className="font-medium">Availability:</span>
                    <span>{userData.availability}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchUser;