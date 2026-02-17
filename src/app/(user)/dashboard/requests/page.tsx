"use client";

import { useEffect, useState } from "react";
import { getMyProjects } from "@/lib/api";
import type { ProjectRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, Clock, CheckCircle, AlertCircle, PlayCircle, XCircle, Eye, Truck, Archive, Ban } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const statusConfig: Record<string, {
    colorLight: string; colorDark: string;
    bgLight: string; bgDark: string;
    borderLight: string; borderDark: string;
    icon: any; label: string;
}> = {
    PENDING: {
        colorLight: "text-yellow-600", colorDark: "text-yellow-400",
        bgLight: "bg-yellow-50", bgDark: "bg-yellow-400/10",
        borderLight: "border-yellow-200", borderDark: "border-yellow-400/20",
        icon: Clock, label: "Pending"
    },
    REVIEWING: {
        colorLight: "text-purple-600", colorDark: "text-purple-400",
        bgLight: "bg-purple-50", bgDark: "bg-purple-400/10",
        borderLight: "border-purple-200", borderDark: "border-purple-400/20",
        icon: Eye, label: "Reviewing"
    },
    IN_PROGRESS: {
        colorLight: "text-blue-600", colorDark: "text-blue-400",
        bgLight: "bg-blue-50", bgDark: "bg-blue-400/10",
        borderLight: "border-blue-200", borderDark: "border-blue-400/20",
        icon: PlayCircle, label: "In Progress"
    },
    COMPLETED: {
        colorLight: "text-emerald-600", colorDark: "text-emerald-400",
        bgLight: "bg-emerald-50", bgDark: "bg-emerald-400/10",
        borderLight: "border-emerald-200", borderDark: "border-emerald-400/20",
        icon: CheckCircle, label: "Completed"
    },
    DELIVERED: {
        colorLight: "text-cyan-600", colorDark: "text-cyan-400",
        bgLight: "bg-cyan-50", bgDark: "bg-cyan-400/10",
        borderLight: "border-cyan-200", borderDark: "border-cyan-400/20",
        icon: Truck, label: "Delivered"
    },
    CLOSED: {
        colorLight: "text-gray-600", colorDark: "text-gray-400",
        bgLight: "bg-gray-50", bgDark: "bg-gray-400/10",
        borderLight: "border-gray-200", borderDark: "border-gray-400/20",
        icon: Archive, label: "Closed"
    },
    REJECTED: {
        colorLight: "text-red-600", colorDark: "text-red-400",
        bgLight: "bg-red-50", bgDark: "bg-red-400/10",
        borderLight: "border-red-200", borderDark: "border-red-400/20",
        icon: XCircle, label: "Rejected"
    },
    CANCELLED: {
        colorLight: "text-orange-600", colorDark: "text-orange-400",
        bgLight: "bg-orange-50", bgDark: "bg-orange-400/10",
        borderLight: "border-orange-200", borderDark: "border-orange-400/20",
        icon: Ban, label: "Cancelled"
    },
};

export default function RequestsPage() {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        async function loadRequests() {
            try {
                setError(null);
                const data = await getMyProjects();
                setRequests(data);
            } catch (error: any) {
                console.error("Failed to load requests", error);
                setError(error.message || "Failed to load requests");
            } finally {
                setLoading(false);
            }
        }

        loadRequests();

        // Poll for updates every 30 seconds
        const interval = setInterval(loadRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center p-8 pt-24">
            <div className="w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1
                        className="text-3xl font-bold text-white"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    >
                        My Requests
                    </h1>
                    <p
                        className="text-white/80"
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                    >
                        Track the status of your service requests.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className={`h-8 w-8 animate-spin ${theme === "light" ? "text-[#E0562B]" : "text-[#EFA163]"}`} />
                    </div>
                ) : error ? (
                    <div
                        className={`rounded-2xl border p-12 text-center ${theme === "light"
                            ? "border-red-200 bg-red-50"
                            : "border-white/10"
                            }`}
                        style={theme === "dark" ? {
                            background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                        } : undefined}
                    >
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${theme === "light" ? "bg-red-100" : "bg-red-400/20"}`}>
                            <AlertCircle size={24} className={theme === "light" ? "text-red-600" : "text-red-400"} />
                        </div>
                        <h3 className={`mb-2 text-xl font-semibold ${theme === "light" ? "text-red-600" : "text-white"}`}>
                            Error Loading Requests
                        </h3>
                        <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>{error}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div
                        className={`rounded-2xl border p-12 text-center backdrop-blur-sm ${theme === "light"
                            ? "border-gray-200 bg-white shadow-lg"
                            : "border-white/10"
                            }`}
                        style={theme === "dark" ? {
                            background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                        } : undefined}
                    >
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${theme === "light" ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}`}>
                            <Clock size={24} />
                        </div>
                        <h3 className={`mb-2 text-xl font-semibold ${theme === "light" ? "text-[#123A9C]" : "text-white"}`}>
                            No requests found
                        </h3>
                        <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
                            You haven't made any service requests yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request, index) => {
                            const config = statusConfig[request.status] || statusConfig.PENDING;
                            const StatusIcon = config.icon;

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${theme === "light"
                                        ? "border-white/40 hover:border-white/60"
                                        : "border-white/10 hover:border-white/20"
                                        }`}
                                    style={theme === "dark" ? {
                                        background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                                    } : {
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(255,255,255,0.6) 100%)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(20px) saturate(180%)',
                                    }}
                                >
                                    {/* Shiny overlay effect */}
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={theme === "dark" ? {
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                                        } : {
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(200,200,220,0.2) 100%)',
                                        }}
                                    />

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
                                        <div>
                                            <h3 className={`mb-1 text-lg font-semibold transition-colors ${theme === "light" ? "text-gray-800 group-hover:text-[#E0562B]" : "text-white group-hover:text-[#EFA163]"}`}>
                                                {request.title}
                                            </h3>
                                            <p className={`text-sm line-clamp-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                                {request.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${request.priority === "URGENT" ? "text-red-400 bg-red-400/10" :
                                                        request.priority === "HIGH" ? "text-orange-400 bg-orange-400/10" :
                                                            request.priority === "MEDIUM" ? "text-yellow-400 bg-yellow-400/10" :
                                                                "text-gray-400 bg-gray-400/10"
                                                    }`}>
                                                    {request.priority}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${theme === "light" ? config.colorLight : config.colorDark
                                            } ${theme === "light" ? "bg-white/80" : "bg-black/30"}`}>
                                            <StatusIcon size={16} />
                                            {config.label}
                                        </div>
                                    </div>

                                    {/* Glow Effect */}
                                    <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-opacity group-hover:opacity-50 ${theme === "light" ? "bg-[#E0562B]/15" : "bg-[#E0562B]/10"}`} />
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
