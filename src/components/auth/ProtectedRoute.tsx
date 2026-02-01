"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, UserRole } from "../../context/AuthContext";
import FullPageLoader from "@/components/ui/FullPageLoader";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            // Not logged in, redirect to login
            // Assuming home page / has login, or dedicated /login
            // Changing this to redirect to home for now as per likely flow
            if (pathname !== "/") {
                router.push("/?redirect=" + encodeURIComponent(pathname));
            }
            return;
        }

        // Role check
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // User does not have permission
            if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router, pathname, allowedRoles]);

    if (loading || !user) {
        // Show loading spinner or nothing while redirecting
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    // If roles defined, check them before rendering
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
