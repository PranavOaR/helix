"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Smoothstep easing function for non-linear motion
 * Creates smooth acceleration/deceleration
 */
function smoothstep(x: number): number {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Linear interpolation for smooth trailing motion
 * @param start Current value
 * @param end Target value
 * @param factor Interpolation speed (0-1, lower = smoother)
 */
function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Check if device is touch-only (no mouse)
 */
function isTouchDevice(): boolean {
    if (typeof window === "undefined") return false;
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );
}

// ============================================
// HOOK 1: useScrollParallax
// ============================================

export interface ScrollParallaxResult {
    ref: React.RefObject<HTMLDivElement | null>;
    scrollY: number;
    scrollProgress: number;
    isInView: boolean;
}

/**
 * Premium scroll-based parallax hook
 * @param speed Movement multiplier (0.3 = slow, 1.0 = fast)
 * @param maxOffset Maximum pixel offset (default 150px)
 */
export function useScrollParallax(
    speed: number = 0.5,
    maxOffset: number = 150
): ScrollParallaxResult {
    const ref = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        let animationFrameId: number;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                animationFrameId = requestAnimationFrame(() => {
                    if (!ref.current) {
                        ticking = false;
                        return;
                    }

                    const element = ref.current;
                    const rect = element.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    // Check if element is in viewport
                    const inView = rect.bottom > 0 && rect.top < windowHeight;
                    setIsInView(inView);

                    if (!inView) {
                        ticking = false;
                        return;
                    }

                    // Calculate progress: 0 = entering from bottom, 0.5 = centered, 1 = leaving from top
                    const rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const progress = clamp(rawProgress, 0, 1);

                    // Apply smoothstep easing for premium feel
                    const eased = progress * progress * (3 - 2 * progress);

                    // Calculate translation with increased range (300px base)
                    // Center point (0.5) = 0px translation
                    const translation = (eased - 0.5) * speed * 300;

                    setScrollY(translation);
                    setScrollProgress(progress); // Keep raw progress for other uses

                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial calculation
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [speed, maxOffset]);

    return { ref, scrollY, scrollProgress, isInView };
}

// ============================================
// HOOK 2: useMouseParallax
// ============================================

export interface MouseParallaxResult {
    ref: React.RefObject<HTMLDivElement | null>;
    mouseX: number;
    mouseY: number;
    isActive: boolean;
}

/**
 * Premium mouse-move parallax hook with smooth trailing
 * @param intensity Movement intensity multiplier
 * @param smoothing Lerp factor for trailing (0.05 = very smooth, 0.2 = responsive)
 */
export function useMouseParallax(
    intensity: number = 1,
    smoothing: number = 0.08
): MouseParallaxResult {
    const ref = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Store target and current values for lerp
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        // Disable on touch devices
        if (isTouchDevice()) {
            return;
        }

        const animate = () => {
            // Lerp current towards target
            currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, smoothing);
            currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, smoothing);

            // Only update state if values changed significantly
            const dx = Math.abs(currentRef.current.x - mouseX);
            const dy = Math.abs(currentRef.current.y - mouseY);

            if (dx > 0.1 || dy > 0.1) {
                setMouseX(currentRef.current.x);
                setMouseY(currentRef.current.y);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();

            // Calculate mouse position relative to element center (-1 to 1)
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize to -1 to 1 range
            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);

            // Apply intensity and max range (30px base)
            targetRef.current.x = clamp(normalizedX * 30 * intensity, -50, 50);
            targetRef.current.y = clamp(normalizedY * 30 * intensity, -50, 50);

            setIsActive(true);
        };

        const handleMouseLeave = () => {
            // Smoothly return to center
            targetRef.current.x = 0;
            targetRef.current.y = 0;
            setIsActive(false);
        };

        // Start animation loop
        animationRef.current = requestAnimationFrame(animate);

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        ref.current?.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ref.current?.removeEventListener("mouseleave", handleMouseLeave);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [intensity, smoothing, mouseX, mouseY]);

    return { ref, mouseX, mouseY, isActive };
}

// ============================================
// HOOK 3: useIdleFloat
// ============================================

export interface IdleFloatResult {
    floatX: number;
    floatY: number;
}

/**
 * Idle floating animation using sine waves
 * @param amplitudeX Horizontal movement range in pixels
 * @param amplitudeY Vertical movement range in pixels
 * @param speedX Horizontal oscillation speed
 * @param speedY Vertical oscillation speed
 */
export function useIdleFloat(
    amplitudeX: number = 10,
    amplitudeY: number = 15,
    speedX: number = 0.0008,
    speedY: number = 0.001
): IdleFloatResult {
    const [floatX, setFloatX] = useState(0);
    const [floatY, setFloatY] = useState(0);
    const startTimeRef = useRef(Date.now());
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const animate = () => {
            const elapsed = Date.now() - startTimeRef.current;

            // Use sine waves with different frequencies for organic motion
            const x = Math.sin(elapsed * speedX) * amplitudeX;
            const y = Math.sin(elapsed * speedY + Math.PI / 4) * amplitudeY; // Phase offset for variety

            setFloatX(x);
            setFloatY(y);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [amplitudeX, amplitudeY, speedX, speedY]);

    return { floatX, floatY };
}

// ============================================
// HOOK 4: useCombinedParallax (All-in-One)
// ============================================

export interface CombinedParallaxResult {
    ref: React.RefObject<HTMLDivElement | null>;
    // Individual values
    scrollY: number;
    mouseX: number;
    mouseY: number;
    floatX: number;
    floatY: number;
    // Combined transform values for layers
    getLayerTransform: (config: LayerConfig) => string;
    scrollProgress: number;
    isInView: boolean;
}

export interface LayerConfig {
    scrollStrength?: number;    // 0-1, how much scroll affects this layer
    mouseStrength?: number;     // 0-1, how much mouse affects this layer
    floatStrength?: number;     // 0-1, how much idle float affects this layer
    scale?: number;             // Optional scale factor based on scroll
}

/**
 * Combined parallax hook that merges scroll, mouse, and idle animations
 * Returns a function to generate transform strings for different layers
 */
export function useCombinedParallax(): CombinedParallaxResult {
    const ref = useRef<HTMLDivElement>(null);

    // Scroll parallax state
    const [scrollY, setScrollY] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isInView, setIsInView] = useState(true);

    // Mouse parallax state
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const mouseTargetRef = useRef({ x: 0, y: 0 });
    const mouseCurrentRef = useRef({ x: 0, y: 0 });

    // Idle float state
    const [floatX, setFloatX] = useState(0);
    const [floatY, setFloatY] = useState(0);
    const startTimeRef = useRef(Date.now());

    // Single animation loop for all effects
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const element = ref.current;

            if (element) {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Check if in view
                const inView = rect.bottom > 0 && rect.top < windowHeight;
                setIsInView(inView);

                // Scroll parallax calculation
                const rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const progress = clamp(rawProgress, 0, 1);
                const easedProgress = smoothstep(progress);
                setScrollProgress(easedProgress);
                setScrollY((easedProgress - 0.5) * 200); // ±100px range
            }

            // Mouse parallax lerp
            if (!isTouchDevice()) {
                mouseCurrentRef.current.x = lerp(mouseCurrentRef.current.x, mouseTargetRef.current.x, 0.08);
                mouseCurrentRef.current.y = lerp(mouseCurrentRef.current.y, mouseTargetRef.current.y, 0.08);
                setMouseX(mouseCurrentRef.current.x);
                setMouseY(mouseCurrentRef.current.y);
            }

            // Idle float calculation
            const elapsed = Date.now() - startTimeRef.current;
            setFloatX(Math.sin(elapsed * 0.0008) * 12);
            setFloatY(Math.sin(elapsed * 0.001 + Math.PI / 4) * 15);

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current || isTouchDevice()) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);

            mouseTargetRef.current.x = clamp(normalizedX * 30, -40, 40);
            mouseTargetRef.current.y = clamp(normalizedY * 25, -30, 30);
        };

        const handleMouseLeave = () => {
            mouseTargetRef.current.x = 0;
            mouseTargetRef.current.y = 0;
        };

        // Start animation loop
        animationFrameId = requestAnimationFrame(animate);

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    /**
     * Generate CSS transform string for a layer based on its config
     */
    const getLayerTransform = useCallback((config: LayerConfig): string => {
        const {
            scrollStrength = 0.5,
            mouseStrength = 0.5,
            floatStrength = 0.5,
            scale,
        } = config;

        const finalX = mouseX * mouseStrength + floatX * floatStrength;
        const finalY = scrollY * scrollStrength + mouseY * mouseStrength + floatY * floatStrength;

        let transform = `translate3d(${finalX}px, ${finalY}px, 0)`;

        if (scale !== undefined) {
            const scaleValue = 1 + (scrollProgress - 0.5) * scale;
            transform += ` scale(${clamp(scaleValue, 0.8, 1.2)})`;
        }

        return transform;
    }, [scrollY, mouseX, mouseY, floatX, floatY, scrollProgress]);

    return {
        ref,
        scrollY,
        mouseX,
        mouseY,
        floatX,
        floatY,
        getLayerTransform,
        scrollProgress,
        isInView,
    };
}

export default {
    useScrollParallax,
    useMouseParallax,
    useIdleFloat,
    useCombinedParallax,
};
