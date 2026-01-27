import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbKJ04hydnihWwGhw9WWsy6n0FUFvVnnY",
  authDomain: "helix-1e1f4.firebaseapp.com",
  projectId: "helix-1e1f4",
  storageBucket: "helix-1e1f4.firebasestorage.app",
  messagingSenderId: "647374059723",
  appId: "1:647374059723:web:6b100b60d9f18beda9c34e",
  measurementId: "G-P7QMYKQJQ0"
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
