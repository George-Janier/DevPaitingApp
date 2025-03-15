import React from "react";
import { motion } from "framer-motion";

const UserProfile = ({ userData }) => {
  if (!userData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8 p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700"
    >
      {/* Profile Header */}
      <div className="flex items-start mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">@{userData.username}</h2>
            <p className="text-gray-400">{userData.email}</p>
          </div>
        </div>
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
    </motion.div>
  );
};

export default UserProfile; 