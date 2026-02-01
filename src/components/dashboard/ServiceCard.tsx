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

    return (
        <Link href={`/dashboard/service/${service.id}`}>
            <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
            >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 group-hover:text-purple-300">
                    <Icon size={24} />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-purple-200">
                    {service.name}
                </h3>

                <p className="mb-6 text-sm text-gray-400">
                    {service.description}
                </p>

                <div className="flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300">
                    Request Service <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Glow Effect */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl transition-opacity group-hover:opacity-40" />
            </motion.div>
        </Link>
    );
}
