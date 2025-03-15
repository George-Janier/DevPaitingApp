import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Save user info to Firestore
export const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  try {
    // Check if user already exists
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        skills: [],
        experience: "",
        availability: "",
      });
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};
