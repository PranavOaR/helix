"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, List, LogOut } from "lucide-react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <ProtectedRoute allowedRoles={["USER"]}>
            <div className="min-h-screen bg-black text-white">
                {/* Navigation - could be top bar or sidebar */}
                <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Helix
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/requests"
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/dashboard/requests') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <List size={18} />
                                My Requests
                            </Link>

                            <button
                                onClick={() => logout()}
                                className="ml-4 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="relative pt-16">
                    {/* Background elements */}
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
                        <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
                    </div>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
