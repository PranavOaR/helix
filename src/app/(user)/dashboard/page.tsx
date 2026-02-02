"use client";

import { useEffect, useState } from "react";
import { getServices, Service } from "@/lib/api";
import ServiceCard from "@/components/dashboard/ServiceCard";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function DashboardPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        async function loadServices() {
            try {
                const data = await getServices();
                setServices(data);
            } catch (error) {
                console.error("Failed to load services", error);
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center p-8 pt-24">
            <div className="w-full max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1
                        className="mb-2 text-4xl font-bold text-white"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    >
                        What would you like to do today?
                    </h1>
                    <p
                        className="text-white/80"
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                    >
                        Select a service to get started with your new project.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-64 animate-pulse rounded-2xl ${theme === "light" ? "bg-gray-200" : "bg-white/5"
                                    }`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ServiceCard service={service} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
