"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Building2, Chrome, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, signUp, login, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    brandName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (mode === "signup") {
      if (!formData.brandName.trim()) {
        setError("Brand name is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        // Create user account
        await signUp(formData.email, formData.password);
        
        // Store brand info in Firestore
        const user = (await import("firebase/auth")).getAuth().currentUser;
        if (user) {
          await setDoc(doc(db, "brands", user.uid), {
            brandName: formData.brandName,
            email: formData.email,
            createdAt: new Date().toISOString(),
            userId: user.uid,
          });
        }

        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        // Login
        await login(formData.email, formData.password);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Parse Firebase error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/30 rounded-full blur-[200px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="relative bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Gradient Border Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-orange-500/20 via-transparent to-rose-500/20 rounded-2xl pointer-events-none" />

          <div className="relative">
            {/* Logo & Branding */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-2xl font-bold text-white">Helix</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Sign in to manage your brand projects
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-800/50 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === "signup"
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-emerald-400">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="brandName"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Brand Name */}
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        name="brandName"
                        placeholder="Brand Name"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="confirmPassword"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Confirm Password */}
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot Password (Login only) */}
              {mode === "login" && (
                <div className="text-right">
                  <button type="button" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-orange-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === "signup" ? "Creating Account..." : "Logging in..."}
                  </>
                ) : (
                  mode === "signup" ? "Create Account" : "Login"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-slate-500">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Login */}
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </motion.button>

            {/* Toggle Link */}
            <p className="text-center text-sm text-slate-400 mt-6">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-orange-500/20 to-rose-500/20 blur-3xl rounded-full pointer-events-none" />
      </motion.div>
    </main>
  );
}
