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
                className={`group relative h-full overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-colors ${
                    theme === "light"
                        ? "border-gray-200 bg-white hover:border-[#E0562B]/30 hover:shadow-lg"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
            >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-colors ${
                    theme === "light"
                        ? "from-[#EFA163]/20 to-[#E0562B]/20 text-[#E0562B] group-hover:text-[#C9471F]"
                        : "from-[#E0562B]/20 to-[#C9471F]/20 text-[#EFA163] group-hover:text-[#E0562B]"
                }`}>
                    <Icon size={24} />
                </div>

                <h3 className={`mb-2 text-xl font-semibold transition-colors ${
                    theme === "light"
                        ? "text-[#123A9C] group-hover:text-[#E0562B]"
                        : "text-white group-hover:text-[#EFA163]"
                }`}>
                    {service.name}
                </h3>

                <p className={`mb-6 text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}>
                    {service.description}
                </p>

                <div className={`flex items-center text-sm font-medium transition-colors ${
                    theme === "light"
                        ? "text-[#E0562B] group-hover:text-[#C9471F]"
                        : "text-[#EFA163] group-hover:text-[#E0562B]"
                }`}>
                    Request Service <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Glow Effect */}
                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-opacity group-hover:opacity-40 ${
                    theme === "light" ? "bg-[#E0562B]/20" : "bg-[#E0562B]/20"
                }`} />
            </motion.div>
        </Link>
    );
}
