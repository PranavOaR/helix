"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LayoutDashboard, List, LogOut, Sun, Moon } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
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
            className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "top-2" : "top-4"
            }`}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                    className={`flex items-center justify-between h-16 px-6 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                        isScrolled 
                            ? theme === "light"
                                ? "bg-white/70 border-white/40 shadow-[0_8px_32px_rgba(73,155,217,0.15)]"
                                : "bg-[#0A1428]/95 border-[#499BD9]/30 shadow-[0_0_20px_rgba(73,155,217,0.2)]"
                            : theme === "light"
                                ? "bg-white/60 border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                                : "bg-[#0A1428]/80 border-[#123A9C]/30"
                    }`}
                    style={{
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
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
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                                isActive('/dashboard') 
                                    ? theme === "light" ? 'text-[#E0562B]' : 'text-[#EFA163]'
                                    : theme === "light" ? 'text-[#123A9C] hover:text-[#E0562B]' : 'text-gray-300 hover:text-[#EFA163]'
                            }`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/requests"
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                                isActive('/dashboard/requests') 
                                    ? theme === "light" ? 'text-[#E0562B]' : 'text-[#EFA163]'
                                    : theme === "light" ? 'text-[#123A9C] hover:text-[#E0562B]' : 'text-gray-300 hover:text-[#EFA163]'
                            }`}
                        >
                            <List size={18} />
                            My Requests
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-all ${
                                theme === "light" 
                                    ? 'bg-[#123A9C]/10 text-[#123A9C] hover:bg-[#123A9C]/20'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
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
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === "light" ? "bg-gray-50" : "bg-[#050A1A]"
        }`}>
            <DashboardNav />
            <main className="relative pt-24">
                {/* Background elements */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className={`absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[100px] ${
                        theme === "light" ? "bg-[#EFA163]/10" : "bg-[#E0562B]/10"
                    }`} />
                    <div className={`absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full blur-[100px] ${
                        theme === "light" ? "bg-[#499BD9]/10" : "bg-[#499BD9]/10"
                    }`} />
                </div>
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
