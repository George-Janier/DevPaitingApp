import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDpIZrSweEO84KuD1VT7ERsMhhCM9V8cW8",
  authDomain: "dev-pairing-app.firebaseapp.com",
  projectId: "dev-pairing-app",
  storageBucket: "dev-pairing-app.firebasestorage.app",
  messagingSenderId: "476255075924",
  appId: "1:476255075924:web:ae1649a59d420ae46137c1",
  measurementId: "G-2BFK0LWL0Z",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, githubProvider };
