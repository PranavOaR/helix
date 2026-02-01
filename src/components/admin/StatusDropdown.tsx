"use client";

import { useState } from "react";
import { Loader2, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "PENDING" | "ACCEPTED" | "IMPLEMENTING" | "COMPLETED" | "REJECTED";

interface StatusDropdownProps {
    currentStatus: Status;
    onStatusChange: (newStatus: Status) => Promise<void>;
    loading?: boolean;
}

const STATUS_ORDER: Status[] = ["PENDING", "ACCEPTED", "IMPLEMENTING", "COMPLETED"];

// Safe transitions map
const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
    PENDING: ["ACCEPTED", "REJECTED"],
    ACCEPTED: ["IMPLEMENTING", "REJECTED"], // Can reject if verified late
    IMPLEMENTING: ["COMPLETED", "ACCEPTED"], // Can go back to Accepted if issues found
    COMPLETED: ["IMPLEMENTING"], // Can re-open if needed
    REJECTED: ["PENDING"], // Can re-open to pending
};

const STATUS_COLORS = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    ACCEPTED: "text-green-400 bg-green-400/10 border-green-400/20",
    IMPLEMENTING: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    COMPLETED: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function StatusDropdown({ currentStatus, onStatusChange, loading }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = async (status: Status) => {
        setIsOpen(false);
        if (status !== currentStatus) {
            await onStatusChange(status);
        }
    };

    const availableStatuses = ["PENDING", "ACCEPTED", "IMPLEMENTING", "COMPLETED", "REJECTED"] as Status[];

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => !loading && setIsOpen(!isOpen)}
                    disabled={loading}
                    className={`inline-flex w-36 items-center justify-between rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-all ${STATUS_COLORS[currentStatus] || "text-gray-400 border-gray-700"
                        } ${loading ? "cursor-not-allowed opacity-70" : "hover:bg-white/5"}`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Updating
                        </div>
                    ) : (
                        <>
                            {currentStatus}
                            <ChevronDown size={14} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-[#0A0A0A] p-1 shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-xl focus:outline-none"
                        >
                            <div className="py-1">
                                {availableStatuses.map((status) => {
                                    const isAllowed = ALLOWED_TRANSITIONS[currentStatus]?.includes(status) || status === currentStatus;

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => isAllowed && handleSelect(status)}
                                            disabled={!isAllowed}
                                            className={`group flex w-full items-center justify-between px-4 py-2 text-xs font-medium uppercase transition-colors ${status === currentStatus
                                                    ? "bg-purple-500/20 text-purple-300"
                                                    : isAllowed
                                                        ? "text-gray-300 hover:bg-white/10 hover:text-white"
                                                        : "cursor-not-allowed text-gray-600 opacity-50"
                                                }`}
                                        >
                                            {status}
                                            {!isAllowed && status !== currentStatus && (
                                                <Lock size={12} className="opacity-50" />
                                            )}
                                            {status === currentStatus && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
