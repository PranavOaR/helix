"use client";

import { motion } from "framer-motion";
import { Service } from "@/lib/api";
import Link from "next/link";
import {
    Globe,
    Palette,
    Flag,
    Smartphone,
    Layout,
    ArrowRight,
    Code
} from "lucide-react";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

// Map icon strings to components
const iconMap: Record<string, React.ElementType> = {
    "Globe": Globe,
    "Palette": Palette,
    "Flag": Flag,
    "Smartphone": Smartphone,
    "Layout": Layout,
    "default": Code
};

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const Icon = iconMap[service.icon] || iconMap["default"];
    const { theme } = useTheme();

    return (
        <Link href={`/dashboard/service/${service.id}`}>
            <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
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

                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-colors ${theme === "light"
                    ? "from-[#E0562B]/30 to-[#C9471F]/20 text-[#C9471F] group-hover:text-[#89100D]"
                    : "from-[#E0562B]/30 to-[#C9471F]/20 text-[#EFA163] group-hover:text-[#E0562B]"
                    }`}>
                    <Icon size={24} />
                </div>

                <h3 className={`mb-2 text-xl font-bold transition-colors ${theme === "light"
                    ? "text-gray-900 group-hover:text-[#C9471F]"
                    : "text-white group-hover:text-[#EFA163]"
                    }`}>
                    {service.name}
                </h3>

                <p className={`mb-6 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"
                    }`}>
                    {service.description}
                </p>

                <div className={`flex items-center text-sm font-semibold transition-colors ${theme === "light"
                    ? "text-[#C9471F] group-hover:text-[#89100D]"
                    : "text-[#EFA163] group-hover:text-[#E0562B]"
                    }`}>
                    Request Service <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Glow Effect */}
                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-opacity group-hover:opacity-50 ${theme === "light" ? "bg-[#E0562B]/15" : "bg-[#E0562B]/10"
                    }`} />
            </motion.div>
        </Link>
    );
}
