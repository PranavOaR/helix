"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { X, ChevronRight, CheckCircle } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
    return classes.filter(Boolean).join(" ");
}

// ============================================
// TYPES
// ============================================
export type CardStackItem = {
    id: string | number;
    title: string;
    description?: string;
    imageSrc?: string;
    href?: string;
    ctaLabel?: string;
    tag?: string;
    icon?: React.ElementType;
    category?: string;
    details?: {
        description: string;
        features: string[];
        process: string;
    };
};

export type CardStackProps<T extends CardStackItem> = {
    items: T[];

    /** Selected index on mount */
    initialIndex?: number;

    /** How many cards are visible around the active (odd recommended) */
    maxVisible?: number;

    /** Card sizing */
    cardWidth?: number;
    cardHeight?: number;

    /** How much cards overlap each other (0..0.8). Higher = more overlap */
    overlap?: number;

    /** Total fan angle (deg). Higher = wider arc */
    spreadDeg?: number;

    /** 3D / depth feel */
    perspectivePx?: number;
    depthPx?: number;
    tiltXDeg?: number;

    /** Active emphasis */
    activeLiftPx?: number;
    activeScale?: number;
    inactiveScale?: number;

    /** Motion */
    springStiffness?: number;
    springDamping?: number;

    /** Behavior */
    loop?: boolean;
    autoAdvance?: boolean;
    intervalMs?: number;
    pauseOnHover?: boolean;

    /** UI */
    showDots?: boolean;
    className?: string;

    /** Hooks */
    onChangeIndex?: (index: number, item: T) => void;

    /** Custom renderer for collapsed card (optional) */
    renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;

    /** Custom renderer for expanded card content (optional) */
    renderExpandedContent?: (item: T) => React.ReactNode;

    /** Enable expandable behavior */
    expandable?: boolean;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function wrapIndex(n: number, len: number) {
    if (len <= 0) return 0;
    return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
    const raw = i - active;
    if (!loop || len <= 1) return raw;
    const alt = raw > 0 ? raw - len : raw + len;
    return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

// ============================================
// EXPANDED CARD MODAL COMPONENT
// ============================================
interface ExpandedCardModalProps<T extends CardStackItem> {
    item: T;
    onClose: () => void;
    renderExpandedContent?: (item: T) => React.ReactNode;
    reduceMotion: boolean | null;
}

function ExpandedCardModal<T extends CardStackItem>({
    item,
    onClose,
    renderExpandedContent,
    reduceMotion,
}: ExpandedCardModalProps<T>) {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const Icon = item.icon;

    // Lock body scroll when mounted - more aggressive approach
    React.useEffect(() => {
        const scrollY = window.scrollY;
        const originalStyle = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            top: document.body.style.top,
            left: document.body.style.left,
            right: document.body.style.right,
        };

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";

        return () => {
            document.body.style.overflow = originalStyle.overflow;
            document.body.style.position = originalStyle.position;
            document.body.style.top = originalStyle.top;
            document.body.style.left = originalStyle.left;
            document.body.style.right = originalStyle.right;
            window.scrollTo(0, scrollY);
        };
    }, []);

    // Handle ESC key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Handle click outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm">
            <motion.div
                ref={modalRef}
                layoutId={`card-stack-item-${item.id}`}
                className="w-full max-w-[900px] max-h-[90vh] rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-2xl border border-white/10 relative overflow-hidden"
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 300, damping: 30 }
                }
            >
                {/* Close Button - Fixed position */}
                <motion.button
                    layoutId={`card-stack-close-${item.id}`}
                    aria-label="Close card"
                    className="absolute top-4 right-4 z-20 h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand-orange hover:text-white border border-white/20 hover:border-brand-orange transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </motion.button>

                {/* Single Scrollable Content Area */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Hero Image Section */}
                    {item.imageSrc && (
                        <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
                            <img
                                src={item.imageSrc}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay at bottom for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 sm:p-8">
                        {/* Icon and Category Row */}
                        <div className="flex items-center gap-4 mb-4">
                            {Icon && (
                                <motion.div
                                    layoutId={`card-stack-icon-${item.id}`}
                                    className="w-14 h-14 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center"
                                >
                                    <Icon className="w-7 h-7 text-brand-orange" />
                                </motion.div>
                            )}
                            {item.category && (
                                <motion.span
                                    layoutId={`card-stack-category-${item.id}`}
                                    className="text-xs font-medium text-brand-orange uppercase tracking-wider px-3 py-1 bg-brand-orange/10 rounded-full"
                                >
                                    {item.category}
                                </motion.span>
                            )}
                        </div>

                        {/* Title */}
                        <motion.h3
                            layoutId={`card-stack-title-${item.id}`}
                            className="font-bold text-white text-2xl sm:text-3xl lg:text-4xl mb-3"
                        >
                            {item.title}
                        </motion.h3>

                        {/* Short description */}
                        {item.description && (
                            <motion.p
                                layoutId={`card-stack-desc-${item.id}`}
                                className="text-white/70 text-base sm:text-lg mb-6"
                            >
                                {item.description}
                            </motion.p>
                        )}

                        {/* Divider */}
                        <div className="border-t border-white/10 my-6" />

                        {/* Detailed Content */}
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {renderExpandedContent ? (
                                renderExpandedContent(item)
                            ) : (
                                <DefaultExpandedContent item={item} />
                            )}
                        </motion.div>

                        {/* Footer CTA */}
                        {item.href && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-red-light text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    {item.ctaLabel || "Learn More"}
                                    <ChevronRight className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================
// DEFAULT EXPANDED CONTENT
// ============================================
function DefaultExpandedContent<T extends CardStackItem>({ item }: { item: T }) {
    if (!item.details) {
        return (
            <p className="text-white/60 text-lg">
                {item.description || "No additional details available."}
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {/* Detailed Description */}
            <div>
                <p className="text-white/80 text-lg leading-relaxed">
                    {item.details.description}
                </p>
            </div>

            {/* Features List */}
            {item.details.features && item.details.features.length > 0 && (
                <div>
                    <h4 className="text-white font-semibold text-xl mb-4">What&apos;s Included</h4>
                    <ul className="space-y-3">
                        {item.details.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/70">
                                <CheckCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Process */}
            {item.details.process && (
                <div>
                    <h4 className="text-white font-semibold text-xl mb-4">Our Process</h4>
                    <p className="text-white/70 leading-relaxed">
                        {item.details.process}
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================
// DEFAULT COLLAPSED CARD
// ============================================
function DefaultServiceCard<T extends CardStackItem>({
    item,
    active,
}: {
    item: T;
    active: boolean;
}) {
    const Icon = item.icon;

    return (
        <div className="relative h-full w-full">
            {/* Background Image */}
            {item.imageSrc ? (
                <div className="absolute inset-0">
                    <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                    {/* Dark overlay for readability - lighter for brighter images */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-red-light/10 opacity-50" />
                </div>
            )}

            {/* Glow effect when active */}
            {active && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/30 to-transparent" />
            )}

            {/* Content with shared layoutIds */}
            <div className="relative z-10 flex h-full flex-col justify-between p-6">
                {/* Top section with icon and category */}
                <div className="flex items-start justify-between">
                    {Icon && (
                        <motion.div
                            layoutId={`card-stack-icon-${item.id}`}
                            className="w-14 h-14 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                        >
                            <Icon className="w-7 h-7 text-brand-orange" />
                        </motion.div>
                    )}
                    {item.category && (
                        <motion.span
                            layoutId={`card-stack-category-${item.id}`}
                            className="text-xs font-medium text-brand-orange uppercase tracking-wider px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10"
                        >
                            {item.category}
                        </motion.span>
                    )}
                </div>

                {/* Bottom section with title and description */}
                <div>
                    <motion.h3
                        layoutId={`card-stack-title-${item.id}`}
                        className="text-xl font-semibold text-white mb-2 drop-shadow-lg"
                    >
                        {item.title}
                    </motion.h3>
                    {item.description && (
                        <motion.p
                            layoutId={`card-stack-desc-${item.id}`}
                            className="text-sm text-white/80 line-clamp-2 drop-shadow"
                        >
                            {item.description}
                        </motion.p>
                    )}

                    {/* Hint to expand when active */}
                    {active && item.details && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-xs text-white/70 flex items-center gap-2">
                                <span>Click to explore</span>
                                <ChevronRight className="w-4 h-4" />
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Close button placeholder for layoutId sync */}
            <motion.div
                layoutId={`card-stack-close-${item.id}`}
                className="absolute top-4 right-4 w-10 h-10 opacity-0 pointer-events-none"
            />
        </div>
    );
}

// ============================================
// MAIN CARDSTACK COMPONENT
// ============================================
export function CardStack<T extends CardStackItem>({
    items,
    initialIndex = 0,
    maxVisible = 7,

    cardWidth = 520,
    cardHeight = 320,

    overlap = 0.48,
    spreadDeg = 48,

    perspectivePx = 1100,
    depthPx = 140,
    tiltXDeg = 12,

    activeLiftPx = 22,
    activeScale = 1.03,
    inactiveScale = 0.94,

    springStiffness = 280,
    springDamping = 28,

    loop = true,
    autoAdvance = false,
    intervalMs = 2800,
    pauseOnHover = true,

    showDots = true,
    className,

    onChangeIndex,
    renderCard,
    renderExpandedContent,
    expandable = true,
}: CardStackProps<T>) {
    const reduceMotion = useReducedMotion();
    const len = items.length;

    // Active card index in the stack
    const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));

    // Currently expanded card ID (null = none expanded)
    const [expandedId, setExpandedId] = React.useState<string | number | null>(null);

    const [hovering, setHovering] = React.useState(false);

    // Find expanded item
    const expandedItem = expandedId !== null ? items.find((i) => i.id === expandedId) : null;

    // Keep active in bounds if items change
    React.useEffect(() => {
        setActive((a) => wrapIndex(a, len));
    }, [len]);

    // Notify parent of index change
    React.useEffect(() => {
        if (!len) return;
        onChangeIndex?.(active, items[active]!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
    const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
    const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

    const canGoPrev = loop || active > 0;
    const canGoNext = loop || active < len - 1;

    const prev = React.useCallback(() => {
        if (!len || !canGoPrev) return;
        setActive((a) => wrapIndex(a - 1, len));
    }, [canGoPrev, len]);

    const next = React.useCallback(() => {
        if (!len || !canGoNext) return;
        setActive((a) => wrapIndex(a + 1, len));
    }, [canGoNext, len]);

    // Keyboard navigation (only when not expanded)
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (expandedId !== null) return; // Don't navigate when expanded
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    };

    // Autoplay (pause when expanded or hovering)
    React.useEffect(() => {
        if (!autoAdvance || reduceMotion || !len) return;
        if ((pauseOnHover && hovering) || expandedId !== null) return;

        const id = window.setInterval(() => {
            if (loop || active < len - 1) next();
        }, Math.max(700, intervalMs));

        return () => window.clearInterval(id);
    }, [
        autoAdvance,
        intervalMs,
        hovering,
        pauseOnHover,
        reduceMotion,
        len,
        loop,
        active,
        next,
        expandedId,
    ]);

    // Handle card click
    const handleCardClick = (item: T, itemIndex: number) => {
        if (itemIndex !== active) {
            // If clicking inactive card, make it active first
            setActive(itemIndex);
        } else if (expandable) {
            // If clicking active card, expand it
            setExpandedId(item.id);
        }
    };

    // Close expanded card
    const handleCloseExpanded = React.useCallback(() => {
        setExpandedId(null);
    }, []);

    if (!len) return null;

    return (
        <LayoutGroup>
            <div
                className={cn("w-full", className)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                {/* Stage */}
                <div
                    className="relative w-full"
                    style={{ height: Math.max(380, cardHeight + 80) }}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                >
                    {/* Background wash / spotlight */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-brand-orange/10 blur-3xl"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-brand-red-light/10 blur-3xl"
                        aria-hidden="true"
                    />

                    <div
                        className="absolute inset-0 flex items-end justify-center"
                        style={{ perspective: `${perspectivePx}px` }}
                    >
                        <AnimatePresence initial={false}>
                            {items.map((item, i) => {
                                const off = signedOffset(i, active, len, loop);
                                const abs = Math.abs(off);
                                const visible = abs <= maxOffset;

                                if (!visible) return null;

                                // Skip rendering if this card is expanded (it's now in the modal)
                                if (item.id === expandedId) return null;

                                // Fan geometry
                                const rotateZ = off * stepDeg;
                                const x = off * cardSpacing;
                                const y = abs * 10;
                                const z = -abs * depthPx;

                                const isActive = off === 0;
                                const scale = isActive ? activeScale : inactiveScale;
                                const lift = isActive ? -activeLiftPx : 0;
                                const rotateX = isActive ? 0 : tiltXDeg;
                                const zIndex = 100 - abs;

                                // Drag only on active card, and only when nothing is expanded
                                const dragProps =
                                    isActive && expandedId === null
                                        ? {
                                            drag: "x" as const,
                                            dragConstraints: { left: 0, right: 0 },
                                            dragElastic: 0.18,
                                            onDragEnd: (
                                                _e: MouseEvent | TouchEvent | PointerEvent,
                                                info: { offset: { x: number }; velocity: { x: number } }
                                            ) => {
                                                if (reduceMotion) return;
                                                const travel = info.offset.x;
                                                const v = info.velocity.x;
                                                const threshold = Math.min(160, cardWidth * 0.22);

                                                if (travel > threshold || v > 650) prev();
                                                else if (travel < -threshold || v < -650) next();
                                            },
                                        }
                                        : {};

                                return (
                                    <motion.div
                                        key={item.id}
                                        layoutId={`card-stack-item-${item.id}`}
                                        className={cn(
                                            "absolute bottom-0 rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl bg-black",
                                            "will-change-transform select-none",
                                            isActive
                                                ? "cursor-pointer border-white/40"
                                                : "cursor-pointer"
                                        )}
                                        style={{
                                            width: cardWidth,
                                            height: cardHeight,
                                            zIndex,
                                            transformStyle: "preserve-3d",
                                        }}
                                        initial={
                                            reduceMotion
                                                ? false
                                                : {
                                                    opacity: 0,
                                                    y: y + 40,
                                                    x,
                                                    rotateZ,
                                                    rotateX,
                                                    scale,
                                                }
                                        }
                                        animate={{
                                            opacity: 1,
                                            x,
                                            y: y + lift,
                                            rotateZ,
                                            rotateX,
                                            scale,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: springStiffness,
                                            damping: springDamping,
                                        }}
                                        onClick={() => handleCardClick(item, i)}
                                        {...dragProps}
                                    >
                                        <div
                                            className="h-full w-full"
                                            style={{
                                                transform: `translateZ(${z}px)`,
                                                transformStyle: "preserve-3d",
                                            }}
                                        >
                                            {renderCard ? (
                                                renderCard(item, { active: isActive })
                                            ) : (
                                                <DefaultServiceCard item={item} active={isActive} />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Dots navigation */}
                {showDots && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            {items.map((it, idx) => {
                                const on = idx === active;
                                return (
                                    <button
                                        key={it.id}
                                        onClick={() => setActive(idx)}
                                        className={cn(
                                            "h-2 w-2 rounded-full transition",
                                            on ? "bg-brand-orange" : "bg-white/30 hover:bg-white/50"
                                        )}
                                        aria-label={`Go to ${it.title}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* EXPANDED CARD OVERLAY */}
                {/* ============================================ */}
                <AnimatePresence>
                    {expandedItem && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                                aria-hidden="true"
                            />

                            {/* Expanded Modal */}
                            <ExpandedCardModal
                                key={`expanded-${expandedItem.id}`}
                                item={expandedItem}
                                onClose={handleCloseExpanded}
                                renderExpandedContent={renderExpandedContent}
                                reduceMotion={reduceMotion}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </LayoutGroup>
    );
}
