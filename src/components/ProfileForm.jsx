import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const ProfileForm = ({ onComplete }) => {
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [existingUsername, setExistingUsername] = useState(""); // Store current username
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
          setExistingUsername(data.username || ""); // Store original username
          setSkills(data.skills?.join(", ") || "");
          setExperience(data.experience || "");
          setAvailability(data.availability || "");
        }
      };
      fetchUserData();
    }
  }, [user]);

  // Check if username is unique only if it's changed
  useEffect(() => {
    if (username.length >= 3 && username !== existingUsername) {
      checkUsernameAvailability(username);
    }
  }, [username]);

  const checkUsernameAvailability = async (enteredUsername) => {
    if (!enteredUsername.trim()) return;
    setIsChecking(true);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", enteredUsername.toLowerCase()));
    const querySnapshot = await getDocs(q);

    setIsUsernameAvailable(querySnapshot.empty);
    setIsChecking(false);
  };

  const handleSave = async () => {
    if (!user) return;

    // Check username availability only if the user changed it
    if (username !== existingUsername) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Username already taken. Please choose another.");
        return;
      }
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        username: username.toLowerCase(),
        skills: skills.split(",").map((s) => s.trim()),
        experience,
        availability,
      },
      { merge: true }
    );

    alert("Profile updated!");
    onComplete(); // Close the modal after saving
  };

  return (
    <div className="p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl w-full">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
    <button
      onClick={onComplete}
      className="text-gray-400 hover:text-white transition-colors"
    >
      ✕
    </button>
  </div>
  
  <div className="space-y-5">
    {/* Username Field */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        🆔 Username
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder-gray-400 transition-all"
          placeholder="e.g. awesome_dev"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {isChecking && (
          <div className="absolute right-3 top-3.5 animate-pulse">⏳</div>
        )}
      </div>
      {!isUsernameAvailable && username !== existingUsername && (
        <p className="text-red-400 text-sm mt-1">⚠️ Username is taken</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Skills
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder-gray-400 transition-all"
          placeholder="e.g. React, Node.js, TypeScript..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        </div>
    
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Experience
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder-gray-400 transition-all"
          placeholder="e.g. 2 years"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        </div>
    
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Availability
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 text-white placeholder-gray-400 transition-all"
          placeholder="e.g. Full-time, Part-time"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
        </div>
    
    </div>
    
    <button
      onClick={handleSave}
      className="w-full py-3.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 mt-4 text-base flex items-center justify-center space-x-2"
      disabled={!isUsernameAvailable || isChecking}
    >
      💾 Save Changes
    </button>
  </div>
</div>
  );
};

export default ProfileForm;
