import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import ProfileForm from "./ProfileForm";
import NavBar from "./NavBar";
import UserProfile from "./UserProfile";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const checkUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        // If user document doesn't exist, show the profile modal
        if (!userDoc.exists()) {
          setShowProfileModal(true);
        }
      }
    };

    checkUserProfile();
  }, [auth.currentUser]);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user);
    }
  }, [user]);

  // Fetch user profile & check if profile is incomplete
  const fetchUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData({
        ...data,
        uid: user.uid  // Add the uid to the userData
      });

      if (!data.skills || !data.experience || !data.availability) {
        setShowProfileModal(true); // Open modal if profile is incomplete
      }
    }
  };

  // Search developers by username or skills
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSelectedUser(null);
      setIsViewingOwnProfile(true);
      return;
    }

    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", searchQuery.toLowerCase()));
    const skillsQuery = query(usersRef, where("skills", "array-contains", searchQuery.toLowerCase()));

    try {
      const usernameResults = await getDocs(usernameQuery);
      const skillsResults = await getDocs(skillsQuery);

      const users = [
        ...usernameResults.docs.map((doc) => ({ ...doc.data(), uid: doc.id })),
        ...skillsResults.docs.map((doc) => ({ ...doc.data(), uid: doc.id })),
      ];

      // Remove duplicate results
      const uniqueUsers = Array.from(new Map(users.map((u) => [u.uid, u])).values());
      setSearchResults(uniqueUsers);
      setSelectedUser(null);
      setIsViewingOwnProfile(false);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Handle viewing own profile
  const handleViewProfile = () => {
    setSearchResults([]);
    setSelectedUser(null);
    setSearchQuery("");
    setIsViewingOwnProfile(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setShowProfileModal={setShowProfileModal}
        onViewProfile={handleViewProfile}
      />

      {/* Current User Profile Section */}
      {isViewingOwnProfile && (
        <UserProfile userData={userData} isOwnProfile={true} />
      )}

      {/* Search Results Section */}
      {searchResults.length > 0 && !selectedUser && !isViewingOwnProfile && (
        <div className="p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">Search Results:</h3>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {searchResults.map((developer) => (
              <div
                key={developer.uid}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedUser(developer);
                  setIsViewingOwnProfile(false);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-400 rounded-full h-10 w-10 flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">@{developer.username}</h4>
                    <p className="text-gray-400">{developer.skills?.slice(0, 3).join(", ")}{developer.skills?.length > 3 ? "..." : ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Selected User Profile */}
      {selectedUser && !isViewingOwnProfile && (
        <div className="relative">
          <button
            onClick={() => setSelectedUser(null)}
            className="absolute top-4 left-4 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors text-white flex items-center space-x-2"
          >
            ← Back to results
          </button>
          <UserProfile userData={selectedUser} isOwnProfile={false} />
        </div>
      )}

      {/* Profile Form Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <ProfileForm onComplete={() => setShowProfileModal(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home; 