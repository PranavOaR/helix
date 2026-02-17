"use client";

import { useEffect, useState } from "react";
import { getAllProjects, updateProjectStatus } from "@/lib/api";
import type { ProjectRequest } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, Search, Filter, RefreshCw } from "lucide-react";
import StatusDropdown from "@/components/admin/StatusDropdown";
import PriorityDropdown from "@/components/admin/PriorityDropdown";
import { useToast } from "@/context/ToastContext";
import { useTheme } from "@/context/ThemeContext";

const ALL_STATUSES = [
    "PENDING", "REVIEWING", "IN_PROGRESS", "COMPLETED",
    "DELIVERED", "CLOSED", "REJECTED", "CANCELLED"
];

export default function AdminDashboard() {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updatingPriorityId, setUpdatingPriorityId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { showToast } = useToast();
    const { theme } = useTheme();

    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        let result = requests;

        if (filterStatus !== "ALL") {
            result = result.filter(r => r.status === filterStatus);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                r =>
                    (r.title && r.title.toLowerCase().includes(lowerSearch)) ||
                    (r.description && r.description.toLowerCase().includes(lowerSearch)) ||
                    (r.user_email && r.user_email.toLowerCase().includes(lowerSearch))
            );
        }

        setFilteredRequests(result);
    }, [requests, filterStatus, search]);

    async function loadRequests() {
        try {
            setLoading(true);
            setRefreshing(true);
            const data = await getAllProjects();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            setUpdatingId(id);
            const result = await updateProjectStatus(id, newStatus);

            // Use server response to update state
            if (result.request) {
                setRequests(prev => prev.map(r =>
                    r.id === id ? { ...r, ...result.request } : r
                ));
            }

            showToast(`Status updated to ${newStatus}`, "success");
        } catch (error: any) {
            console.error("Failed to update status", error);
            showToast(error.message || "Failed to update status", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePriorityChange = async (id: number, newPriority: string) => {
        try {
            setUpdatingPriorityId(id);
            const result = await updateProjectStatus(id, undefined as any, newPriority);

            if (result.request) {
                setRequests(prev => prev.map(r =>
                    r.id === id ? { ...r, ...result.request } : r
                ));
            }

            showToast(`Priority updated to ${newPriority}`, "success");
        } catch (error: any) {
            console.error("Failed to update priority", error);
            showToast(error.message || "Failed to update priority", "error");
        } finally {
            setUpdatingPriorityId(null);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1
                            className="text-3xl font-bold text-white"
                            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                        >
                            Requests Management
                        </h1>
                        <p
                            className="text-white/80"
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                        >
                            Manage and update client service requests.
                        </p>
                    </div>
                    <motion.button
                        onClick={loadRequests}
                        disabled={refreshing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${theme === "light"
                            ? "border-white/40 hover:border-white/60 font-bold text-sm"
                            : "border-white/20 hover:border-white/30 font-semibold text-sm"
                            }`}
                        style={theme === "dark" ? {
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            color: refreshing ? '#9CA3AF' : '#EFA163',
                            fontSize: '0.875rem'
                        } : {
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(240,240,245,0.5) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            color: refreshing ? '#9CA3AF' : '#C9471F',
                            fontSize: '0.875rem'
                        }}
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Refreshing..." : "Refresh Data"}
                    </motion.button>
                </div>

                {/* Filters */}
                <div className="mb-8 grid gap-4 md:grid-cols-[1fr_200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by email, title, or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full rounded-xl border pl-10 pr-4 py-3 placeholder-gray-500 focus:outline-none transition-all ${theme === "light"
                                ? "border-white/40 bg-white/70 text-gray-900 focus:border-[#E0562B]"
                                : "border-white/10 bg-white/5 text-white focus:border-[#EFA163]"
                                }`}
                            style={{ backdropFilter: 'blur(10px)' }}
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`w-full appearance-none rounded-xl border px-4 py-3 focus:outline-none transition-all ${theme === "light"
                                ? "border-white/40 bg-white/70 text-gray-900 focus:border-[#E0562B]"
                                : "border-white/10 bg-white/5 text-white focus:border-[#EFA163]"
                                }`}
                            style={{ backdropFilter: 'blur(10px)' }}
                        >
                            <option value="ALL">All Statuses</option>
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Table */}
                <div
                    className={`rounded-xl border ${theme === "light"
                        ? "border-white/40 bg-white/70"
                        : "border-white/10 bg-white/5"
                        }`}
                    style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
                >
                    <div className="overflow-x-auto">
                        <table className={`w-full text-left text-sm ${theme === "light" ? "text-gray-700" : "text-gray-400"
                            }`}>
                            <thead className={`text-xs uppercase ${theme === "light"
                                ? "bg-white/30 text-gray-800 font-bold"
                                : "bg-white/5 text-gray-300"
                                }`}>
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Request</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === "light" ? "divide-gray-200" : "divide-white/5"
                                }`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Loader2 className={`mx-auto h-8 w-8 animate-spin ${theme === "light" ? "text-[#E0562B]" : "text-[#EFA163]"
                                                }`} />
                                        </td>
                                    </tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No requests found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className={theme === "light" ? "hover:bg-white/50" : "hover:bg-white/5"}>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{request.id}</td>
                                            <td className={`px-6 py-4 font-medium ${theme === "light" ? "text-gray-900" : "text-white"
                                                }`}>
                                                {request.user_email || "Unknown User"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`block font-semibold ${theme === "light" ? "text-gray-900" : "text-white"
                                                    }`}>{request.title}</span>
                                                <span className="truncate block max-w-xs text-xs text-gray-500">{request.description}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <PriorityDropdown
                                                    currentPriority={request.priority as any}
                                                    loading={updatingPriorityId === request.id}
                                                    onPriorityChange={(newPriority) => handlePriorityChange(request.id, newPriority)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusDropdown
                                                    currentStatus={request.status as any}
                                                    loading={updatingId === request.id}
                                                    onStatusChange={(newStatus) => handleStatusChange(request.id, newStatus)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
