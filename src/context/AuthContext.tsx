"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { getUserProfile, UserProfile } from "../lib/api";

export type UserRole = "USER" | "ADMIN";

export interface DashboardUser extends User {
  role: UserRole;
}

interface AuthContextType {
  user: DashboardUser | null;
  loading: boolean; // True until initial auth check AND role resolution are done
  authLoading: boolean; // Specific to Firebase status
  roleLoading: boolean; // Specific to Role fetch
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false); // Only true when user is found and we are fetching role

  const resolveUserRole = async (firebaseUser: User): Promise<UserRole> => {
    try {
      // Try Backend Endpoint only - avoid Firestore to prevent offline errors
      const backendProfile = await getUserProfile();
      if (backendProfile && backendProfile.role) {
        return backendProfile.role as UserRole;
      }
    } catch (error) {
      console.error("Role resolution error:", error);
      // Continue to default fallback
    }

    return "USER"; // Default safe fallback
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        setRoleLoading(true);
        // User is signed in, resolve role
        const role = await resolveUserRole(firebaseUser);

        const dashboardUser: DashboardUser = {
          ...firebaseUser,
          role: role,
        };
        setUser(dashboardUser);
        setRoleLoading(false);
      } else {
        // User is signed out
        setUser(null);
        setRoleLoading(false);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign Up Error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  const loading = authLoading || roleLoading;

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, roleLoading, signUp, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
