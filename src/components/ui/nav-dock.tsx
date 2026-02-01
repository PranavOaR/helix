"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export type NavDockItem = {
    title: string;
    icon: React.ReactNode;
    href: string;
};

export const NavDock = ({
    items,
    className,
}: {
    items: NavDockItem[];
    className?: string;
}) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "hidden md:flex items-end gap-8 rounded-2xl bg-white/50 backdrop-blur-md px-6 py-3 border border-brand-navy/10",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    href,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleTransform = useTransform(distance, [-150, 0, 150], [1, 1.15, 1]);

    const scale = useSpring(scaleTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    return (
        <a href={href} className="flex flex-col items-center gap-1.5">
            <motion.div
                ref={ref}
                style={{ scale }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "relative flex w-14 h-9 items-center justify-center rounded-xl transition-all duration-200",
                    "bg-gradient-to-br from-brand-orange/10 to-brand-red-light/10 border border-brand-orange/20",
                    hovered && "border-brand-orange/50 from-brand-orange/20 to-brand-red-light/20 shadow-lg shadow-brand-orange/10"
                )}
            >
                <div className="w-4 h-4 text-brand-orange">
                    {icon}
                </div>
            </motion.div>
            <span className={cn(
                "text-xs font-medium transition-colors duration-200",
                hovered ? "text-brand-orange" : "text-brand-navy/70"
            )}>
                {title}
            </span>
        </a>
    );
}

// Mobile version - collapsible menu
export const NavDockMobile = ({
    items,
    className,
}: {
    items: NavDockItem[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="mobile-nav"
                        className="absolute right-0 top-full mt-2 flex flex-col gap-2 bg-white rounded-2xl p-3 shadow-xl border border-brand-navy/10"
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    >
                        {items.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-brand-orange/10 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                <div className="w-8 h-8 flex items-center justify-center text-brand-orange">
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium text-brand-navy">{item.title}</span>
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange/10 to-brand-red-light/10 border border-brand-orange/20 text-brand-orange transition-all hover:border-brand-orange/40"
                aria-label="Toggle navigation menu"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {open ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="4" y1="8" x2="20" y2="8" />
                            <line x1="4" y1="16" x2="20" y2="16" />
                        </>
                    )}
                </motion.svg>
            </button>
        </div>
    );
};
