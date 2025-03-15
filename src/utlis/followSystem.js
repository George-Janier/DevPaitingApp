import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Follow a user
export const followUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  try {
    await setDoc(doc(db, "followers", `${currentUserId}_${targetUserId}`), {
      follower: currentUserId,
      following: targetUserId,
    });
    console.log("Followed successfully!");
  } catch (error) {
    console.error("Error following user:", error);
  }
};

// Unfollow a user
export const unfollowUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;

  try {
    await deleteDoc(doc(db, "followers", `${currentUserId}_${targetUserId}`));
    console.log("Unfollowed successfully!");
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};

// Check if a user is followed
export const isFollowing = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return false;

  try {
    const docRef = doc(db, "followers", `${currentUserId}_${targetUserId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};
