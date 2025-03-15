import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const NavBar = ({ searchQuery, setSearchQuery, handleSearch, setShowProfileModal, onViewProfile }) => {
  return (
    <nav className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
      {/* Logo - Left */}
      <div className="flex-shrink-0 w-32">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          DevPair
        </h2>
      </div>

      {/* Search - Center */}
      <div className="flex-grow max-w-2xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search developers..."
            className="w-full px-4 py-2 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Buttons - Right */}
      <div className="flex-shrink-0 flex items-center space-x-4">
        <button
          onClick={onViewProfile}
          className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xl hover:opacity-90 transition-opacity"
        >
          👤
        </button>
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
        >
          ✏️ <span>Edit</span>
        </button>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar; 