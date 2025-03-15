import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Check if a user already has a username
export const getUserFromFirestore = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Check if the username is already taken
export const isUsernameAvailable = async (username) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // true if no user has this username
};

// Save user data with a unique username
export const saveUserToFirestore = async (user, username) => {
  if (!user || !username) return false;

  try {
    const available = await isUsernameAvailable(username);
    if (!available) {
      alert("Username is already taken. Please choose another.");
      return false;
    }

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      username,
      skills: [],
      experience: "",
      availability: "",
    });

    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    return false;
  }
};
