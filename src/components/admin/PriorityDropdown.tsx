"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface PriorityDropdownProps {
    currentPriority: Priority;
    onPriorityChange: (newPriority: Priority) => Promise<void>;
    loading?: boolean;
}

const PRIORITY_COLORS: Record<Priority, string> = {
    LOW: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    HIGH: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    URGENT: "text-red-400 bg-red-400/10 border-red-400/20",
};

const PRIORITY_LABELS: Record<Priority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

const allPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function PriorityDropdown({ currentPriority, onPriorityChange, loading }: PriorityDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.right - 144, // w-36 = 9rem = 144px
            });
        }
    }, [isOpen]);

    const handleSelect = async (priority: Priority) => {
        setIsOpen(false);
        if (priority !== currentPriority) {
            await onPriorityChange(priority);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !loading && setIsOpen(!isOpen)}
                disabled={loading}
                className={`inline-flex w-28 items-center justify-between rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-all ${PRIORITY_COLORS[currentPriority] || "text-gray-400 border-gray-700"
                    } ${loading ? "cursor-not-allowed opacity-70" : "hover:bg-white/5"}`}
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                    </div>
                ) : (
                    <>
                        {PRIORITY_LABELS[currentPriority] || currentPriority}
                        <ChevronDown size={14} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
                        className="fixed z-[9999] w-36 rounded-xl border border-white/10 bg-[#0A0A0A] p-1 shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-xl"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    >
                        <div className="py-1">
                            {allPriorities.map((priority) => (
                                <button
                                    key={priority}
                                    onClick={() => handleSelect(priority)}
                                    className={`group flex w-full items-center justify-between px-4 py-2 text-xs font-medium uppercase transition-colors ${priority === currentPriority
                                        ? "bg-purple-500/20 text-purple-300"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {PRIORITY_LABELS[priority]}
                                    {priority === currentPriority && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>,
                document.body
            )}
        </div>
    );
}
