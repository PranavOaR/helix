"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-black text-white">
                <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 w-full items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <Link href="/admin" className="text-xl font-bold text-white">
                                Helix <span className="text-purple-500">Admin</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                                <Shield size={14} /> Admin Mode
                            </span>

                            <button
                                onClick={() => logout()}
                                className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="pt-16">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
