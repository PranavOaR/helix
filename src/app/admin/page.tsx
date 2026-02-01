"use client";

import { useEffect, useState } from "react";
import { getAllProjects, updateProjectStatus } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, Search, Filter, ChevronDown, Check } from "lucide-react";
import StatusDropdown from "@/components/admin/StatusDropdown";
import { useToast } from "@/context/ToastContext";

// Types
// Types
interface ProjectRequest {
    id: number;
    service_type: string;
    status: "PENDING" | "ACCEPTED" | "IMPLEMENTING" | "COMPLETED" | "REJECTED";
    created_at: string;
    requirements_text: string;
    user_email?: string; // Assuming backend returns this for admin
}

const ALL_STATUSES = ["PENDING", "ACCEPTED", "IMPLEMENTING", "COMPLETED", "REJECTED"];

export default function AdminDashboard() {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const { showToast } = useToast();

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
                    (r.service_type && r.service_type.toLowerCase().includes(lowerSearch)) ||
                    (r.requirements_text && r.requirements_text.toLowerCase().includes(lowerSearch)) ||
                    (r.user_email && r.user_email.toLowerCase().includes(lowerSearch))
            );
        }

        setFilteredRequests(result);
    }, [requests, filterStatus, search]);

    async function loadRequests() {
        try {
            setLoading(true);
            const data = await getAllProjects();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            setUpdatingId(id);
            await updateProjectStatus(id, newStatus);

            // Optimistic update
            setRequests(prev => prev.map(r =>
                r.id === id ? { ...r, status: newStatus as any } : r
            ));

            showToast(`Status updated to ${newStatus}`, "success");
        } catch (error) {
            console.error("Failed to update status", error);
            showToast("Failed to update status", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Requests Management</h1>
                        <p className="text-gray-400">Manage and update client service requests.</p>
                    </div>
                    <button
                        onClick={loadRequests}
                        className="text-sm text-purple-400 hover:text-purple-300 underline"
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-8 grid gap-4 md:grid-cols-[1fr_200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by email, service, or requirements..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                        >
                            <option value="ALL">All Statuses</option>
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 text-xs uppercase text-gray-300">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Requested</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-500" />
                                        </td>
                                    </tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No requests found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{request.id}</td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {request.user_email || "Unknown User"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="block text-white">{request.service_type}</span>
                                                <span className="truncate block max-w-xs text-xs text-gray-500">{request.requirements_text}</span>
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
