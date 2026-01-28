"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Mock user type (mimics Firebase User structure)
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Auth Provider - works without Firebase credentials
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading] = useState(false);

  const signUp = async (email: string, password: string) => {
    // Mock sign up - simulate delay then set user
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      uid: "mock-user-" + Date.now(),
      email: email,
      displayName: email.split("@")[0],
    });
  };

  const login = async (email: string, password: string) => {
    // Mock login - simulate delay then set user
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      uid: "mock-user-" + Date.now(),
      email: email,
      displayName: email.split("@")[0],
    });
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      uid: "google-mock-user-" + Date.now(),
      email: "demo@gmail.com",
      displayName: "Demo User",
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, loginWithGoogle, logout }}>
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
