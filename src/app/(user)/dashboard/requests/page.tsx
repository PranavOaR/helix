"use client";

import { useEffect, useState } from "react";
import { getMyProjects } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, Clock, CheckCircle, AlertCircle, PlayCircle, XCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Types matching the backend response
interface ProjectRequest {
    id: number;
    service_type: string;
    status: "PENDING" | "ACCEPTED" | "IMPLEMENTING" | "COMPLETED" | "REJECTED";
    created_at: string;
    requirements_text: string;
}

const statusConfig = {
    PENDING: { 
        colorLight: "text-yellow-600", colorDark: "text-yellow-400", 
        bgLight: "bg-yellow-50", bgDark: "bg-yellow-400/10", 
        borderLight: "border-yellow-200", borderDark: "border-yellow-400/20", 
        icon: Clock, label: "Pending" 
    },
    ACCEPTED: { 
        colorLight: "text-green-600", colorDark: "text-green-400", 
        bgLight: "bg-green-50", bgDark: "bg-green-400/10", 
        borderLight: "border-green-200", borderDark: "border-green-400/20", 
        icon: CheckCircle, label: "Accepted" 
    },
    IMPLEMENTING: { 
        colorLight: "text-blue-600", colorDark: "text-blue-400", 
        bgLight: "bg-blue-50", bgDark: "bg-blue-400/10", 
        borderLight: "border-blue-200", borderDark: "border-blue-400/20", 
        icon: PlayCircle, label: "In Progress" 
    },
    COMPLETED: { 
        colorLight: "text-[#E0562B]", colorDark: "text-[#EFA163]", 
        bgLight: "bg-orange-50", bgDark: "bg-[#E0562B]/10", 
        borderLight: "border-orange-200", borderDark: "border-[#E0562B]/20", 
        icon: CheckCircle, label: "Completed" 
    },
    REJECTED: { 
        colorLight: "text-red-600", colorDark: "text-red-400", 
        bgLight: "bg-red-50", bgDark: "bg-red-400/10", 
        borderLight: "border-red-200", borderDark: "border-red-400/20", 
        icon: XCircle, label: "Rejected" 
    },
};

function formatServiceType(type: string) {
    const map: Record<string, string> = {
        website: "Website Development",
        uiux: "UI/UX Design",
        branding: "Branding",
        app: "Mobile App",
        canva: "Canva Design"
    };
    return map[type] || type;
}

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
                    <h1 className={`text-3xl font-bold ${theme === "light" ? "text-[#123A9C]" : "text-white"}`}>
                        My Requests
                    </h1>
                    <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
                        Track the status of your service requests.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className={`h-8 w-8 animate-spin ${theme === "light" ? "text-[#E0562B]" : "text-[#EFA163]"}`} />
                    </div>
                ) : error ? (
                    <div className={`rounded-2xl border p-12 text-center ${theme === "light" ? "border-red-200 bg-red-50" : "border-red-400/20 bg-red-400/10"}`}>
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${theme === "light" ? "bg-red-100" : "bg-red-400/20"}`}>
                            <AlertCircle size={24} className={theme === "light" ? "text-red-600" : "text-red-400"} />
                        </div>
                        <h3 className={`mb-2 text-xl font-semibold ${theme === "light" ? "text-red-600" : "text-red-400"}`}>
                            Error Loading Requests
                        </h3>
                        <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>{error}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className={`rounded-2xl border p-12 text-center backdrop-blur-sm ${theme === "light" ? "border-gray-200 bg-white shadow-lg" : "border-white/10 bg-white/5"}`}>
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
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm transition-all ${
                                        theme === "light"
                                            ? `${config.borderLight} ${config.bgLight} hover:shadow-lg`
                                            : `${config.borderDark} ${config.bgDark} hover:bg-opacity-20`
                                    }`}
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className={`mb-1 text-lg font-semibold ${theme === "light" ? "text-[#123A9C]" : "text-white"}`}>
                                                {formatServiceType(request.service_type)}
                                            </h3>
                                            <p className={`text-sm line-clamp-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                                {request.requirements_text}
                                            </p>
                                            <span className={`mt-2 inline-block text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${ 
                                            theme === "light" ? config.colorLight : config.colorDark
                                        } ${theme === "light" ? "bg-white/80" : "bg-black/20"}`}>
                                            <StatusIcon size={16} />
                                            {config.label}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
