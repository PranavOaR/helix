"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  Home,
  FolderOpen,
  Plus,
  Clock,
  CheckCircle,
  Loader2,
  LayoutDashboard,
  Settings,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </main>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-white">Helix</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-400">
            Manage your brand projects and track their progress.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <button className="p-4 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl text-left hover:shadow-xl hover:shadow-orange-500/20 transition-all group">
            <Plus className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold">New Project</h3>
            <p className="text-white/70 text-sm">Request a new service</p>
          </button>

          <button className="p-4 bg-slate-800/50 border border-white/10 rounded-xl text-left hover:border-white/20 transition-all group">
            <FolderOpen className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold">My Projects</h3>
            <p className="text-slate-400 text-sm">View all projects</p>
          </button>

          <button className="p-4 bg-slate-800/50 border border-white/10 rounded-xl text-left hover:border-white/20 transition-all group">
            <Clock className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold">In Progress</h3>
            <p className="text-slate-400 text-sm">Track active work</p>
          </button>

          <button className="p-4 bg-slate-800/50 border border-white/10 rounded-xl text-left hover:border-white/20 transition-all group">
            <CheckCircle className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold">Completed</h3>
            <p className="text-slate-400 text-sm">View deliverables</p>
          </button>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-orange-400" />
                Recent Projects
              </h2>
              <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                View All
              </button>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No projects yet</h3>
              <p className="text-slate-400 text-sm mb-4">
                Start by requesting your first service
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                Create New Project
              </button>
            </div>
          </motion.div>

          {/* Sidebar Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Email</span>
                  <span className="text-white text-sm truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-slate-400">Total Projects</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-400">0</div>
                  <div className="text-xs text-slate-400">In Progress</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-xs text-slate-400">In Review</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400">0</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
