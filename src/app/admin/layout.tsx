"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LogOut, Shield } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function AdminContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { theme } = useTheme();

    return (
        <div className="min-h-screen relative">
            {/* Fixed Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("/dashboard-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#0a0a0a'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                <nav className="fixed left-0 right-0 top-4 z-50 px-6">
                    <div
                        className={`mx-auto max-w-7xl flex h-16 items-center justify-between px-6 rounded-full border transition-all duration-300 ${theme === "light"
                            ? "bg-white/30 border-white/20 shadow-[0_8px_32px_rgba(73,155,217,0.15)]"
                            : "bg-black/20 border-white/10 shadow-[0_0_20px_rgba(73,155,217,0.2)]"
                            }`}
                        style={{
                            backdropFilter: 'blur(24px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="flex items-center">
                                <BrandLogo variant="navbar" />
                            </Link>
                            <span
                                className="flex items-center gap-2 text-xs uppercase tracking-wider"
                                style={{
                                    color: theme === "light" ? "#EFA163" : "#EFA163",
                                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                                    fontWeight: theme === "light" ? 600 : 700
                                }}
                            >
                                <Shield size={14} /> Admin Mode
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => logout()}
                                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#E0562B] to-[#C9471F] hover:from-[#C9471F] hover:to-[#89100D] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-[0_4px_20px_rgba(224,86,43,0.4)] hover:scale-105 text-sm"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="pt-24">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ThemeProvider>
                <AdminContent>{children}</AdminContent>
            </ThemeProvider>
        </ProtectedRoute>
    );
}
