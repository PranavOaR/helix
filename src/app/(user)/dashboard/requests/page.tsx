"use client";

import { useEffect, useState } from "react";
import { getMyProjects } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, Clock, CheckCircle, AlertCircle, PlayCircle, XCircle } from "lucide-react";

// Types matching the backend response
interface ProjectRequest {
    id: number;
    service_type: string;
    status: "PENDING" | "ACCEPTED" | "IMPLEMENTING" | "COMPLETED" | "REJECTED";
    created_at: string;
    requirements_text: string;
}

const statusConfig = {
    PENDING: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: Clock },
    ACCEPTED: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", icon: CheckCircle },
    IMPLEMENTING: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: PlayCircle },
    COMPLETED: { color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", icon: CheckCircle },
    REJECTED: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
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

    useEffect(() => {
        async function loadRequests() {
            try {
                const data = await getMyProjects();
                setRequests(data);
            } catch (error) {
                console.error("Failed to load requests", error);
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
                    <h1 className="text-3xl font-bold text-white">My Requests</h1>
                    <p className="text-gray-400">Track the status of your service requests.</p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-gray-400">
                            <Clock size={24} />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-white">No requests found</h3>
                        <p className="text-gray-400">You haven't made any service requests yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request, index) => {
                            const config = statusConfig[request.status] || statusConfig.PENDING;
                            const StatusIcon = config.icon;

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-6 backdrop-blur-sm transition-all hover:bg-opacity-20`}
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="mb-1 text-lg font-semibold text-white">
                                                {formatServiceType(request.service_type)}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                {request.requirements_text}
                                            </p>
                                            <span className="mt-2 inline-block text-xs text-gray-500">
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${config.color} bg-black/20`}>
                                            <StatusIcon size={16} />
                                            {request.status}
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
