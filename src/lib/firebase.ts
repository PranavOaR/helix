import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbONwRnREZPhuvh6rT4_YynD3xVnX4YGI",
  authDomain: "helix-f5dcf.firebaseapp.com",
  projectId: "helix-f5dcf",
  storageBucket: "helix-f5dcf.firebasestorage.app",
  messagingSenderId: "250874285196",
  appId: "1:250874285196:web:216fd42385e3e90ebf3fa9",
  measurementId: "G-F4BYBEN5ZM"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;

