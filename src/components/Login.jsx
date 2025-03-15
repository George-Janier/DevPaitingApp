import React from "react";
import { auth, googleProvider, githubProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";

const Login = () => {
  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      alert("Login Successful!");
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center space-y-8"
  >
    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
      DevPair
    </h1>
    
    <div className="bg-gray-800 p-8 rounded-3xl shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">
        Connect with Developers Worldwide
      </h2>
      
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin(googleProvider)}
          className="w-full bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-full flex items-center justify-center space-x-3 transition-colors"
        >
          <span className="text-2xl">🔵</span>
          <span className="font-medium text-gray-100">Continue with Google</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin(githubProvider)}
          className="w-full bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-full flex items-center justify-center space-x-3 transition-colors"
        >
          <span className="text-2xl">⚫</span>
          <span className="font-medium text-gray-100">Continue with GitHub</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
</div>
  );
};

export default Login;
