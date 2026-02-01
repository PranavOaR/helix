"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now().toString();
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            layout
                            className={`flex min-w-[300px] items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md ${toast.type === "success"
                                    ? "border-green-500/20 bg-green-950/80 text-green-200"
                                    : toast.type === "error"
                                        ? "border-red-500/20 bg-red-950/80 text-red-200"
                                        : "border-blue-500/20 bg-blue-950/80 text-blue-200"
                                }`}
                        >
                            {toast.type === "success" && <CheckCircle size={20} className="text-green-400" />}
                            {toast.type === "error" && <AlertCircle size={20} className="text-red-400" />}
                            {toast.type === "info" && <Info size={20} className="text-blue-400" />}

                            <p className="flex-1 text-sm font-medium">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="rounded-full p-1 opacity-60 hover:bg-white/10 hover:opacity-100"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
