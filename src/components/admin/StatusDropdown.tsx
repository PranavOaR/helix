"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type Status = "PENDING" | "REVIEWING" | "IN_PROGRESS" | "COMPLETED" | "DELIVERED" | "CLOSED" | "REJECTED" | "CANCELLED";

interface StatusDropdownProps {
    currentStatus: Status;
    onStatusChange: (newStatus: Status) => Promise<void>;
    loading?: boolean;
}

// Phase 2 workflow transitions
const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
    PENDING: ["REVIEWING", "REJECTED", "CANCELLED"],
    REVIEWING: ["IN_PROGRESS", "REJECTED", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: ["DELIVERED"],
    DELIVERED: ["CLOSED"],
    CLOSED: [],
    REJECTED: [],
    CANCELLED: [],
};

const STATUS_COLORS: Record<Status, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    REVIEWING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    IN_PROGRESS: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    COMPLETED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    DELIVERED: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    CLOSED: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
    CANCELLED: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const STATUS_LABELS: Record<Status, string> = {
    PENDING: "Pending",
    REVIEWING: "Reviewing",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    DELIVERED: "Delivered",
    CLOSED: "Closed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
};

export default function StatusDropdown({ currentStatus, onStatusChange, loading }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.right - 192, // 192 = w-48 = 12rem
            });
        }
    }, [isOpen]);

    const handleSelect = async (status: Status) => {
        setIsOpen(false);
        if (status !== currentStatus) {
            await onStatusChange(status);
        }
    };

    const allStatuses: Status[] = ["PENDING", "REVIEWING", "IN_PROGRESS", "COMPLETED", "DELIVERED", "CLOSED", "REJECTED", "CANCELLED"];
    const isTerminal = ALLOWED_TRANSITIONS[currentStatus]?.length === 0;

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !loading && !isTerminal && setIsOpen(!isOpen)}
                disabled={loading || isTerminal}
                className={`inline-flex w-36 items-center justify-between rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-all ${STATUS_COLORS[currentStatus] || "text-gray-400 border-gray-700"
                    } ${loading || isTerminal ? "cursor-not-allowed opacity-70" : "hover:bg-white/5"}`}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Updating
                    </div>
                ) : (
                    <>
                        {STATUS_LABELS[currentStatus] || currentStatus}
                        {!isTerminal && <ChevronDown size={14} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                        {isTerminal && <Lock size={12} className="ml-2 opacity-50" />}
                    </>
                )}
            </button>

            {isOpen && typeof document !== "undefined" && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed z-[9999] w-48 rounded-xl border border-white/10 bg-[#0A0A0A] p-1 shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-xl"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    >
                        <div className="py-1">
                            {allStatuses.map((status) => {
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
                                        {STATUS_LABELS[status] || status}
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
                </>,
                document.body
            )}
        </div>
    );
}
