"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LayoutDashboard, List, LogOut } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";

function DashboardNav() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header
            className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "top-2" : "top-4"
                }`}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`flex items-center justify-between h-16 px-6 rounded-full border transition-all duration-300 ${isScrolled
                        ? theme === "light"
                            ? "bg-white/30 border-white/20 shadow-[0_8px_32px_rgba(73,155,217,0.15)]"
                            : "bg-black/20 border-white/10 shadow-[0_0_20px_rgba(73,155,217,0.2)]"
                        : theme === "light"
                            ? "bg-white/20 border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                            : "bg-black/15 border-white/10"
                        }`}
                    style={{
                        backdropFilter: 'blur(24px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                    }}
                >
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center">
                        <BrandLogo variant="navbar" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive('/dashboard')
                                ? 'text-[#EFA163]'
                                : 'text-white hover:text-[#EFA163]'
                                }`}
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/requests"
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive('/dashboard/requests')
                                ? 'text-[#EFA163]'
                                : 'text-white hover:text-[#EFA163]'
                                }`}
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                        >
                            <List size={18} />
                            My Requests
                        </Link>
                    </div>

                    {/* Actions */}
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
        </header>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen relative">
            {/* Fixed Background Image */}
            <div
                className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/dashboard-bg.png')",
                    backgroundColor: "#0a0a0a"
                }}
            />

            <DashboardNav />
            <main className="relative pt-24">
                {children}
            </main>
        </div>
    );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={["USER"]}>
            <ThemeProvider>
                <DashboardContent>{children}</DashboardContent>
            </ThemeProvider>
        </ProtectedRoute>
    );
}
