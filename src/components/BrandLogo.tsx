"use client";

import Image from "next/image";

interface BrandLogoProps {
    /**
     * Size variant for the logo
     * - navbar: 32px height (for navigation)
     * - hero: 160px (for hero section centerpiece)
     * - footer: 32px height (for footer)
     */
    variant?: "navbar" | "hero" | "footer";
    /**
     * Custom width (overrides variant)
     */
    width?: number;
    /**
     * Custom height (overrides variant)
     */
    height?: number;
    /**
     * Whether to show a glow effect behind the logo
     */
    withGlow?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
}

const sizeMap = {
    navbar: { width: 120, height: 32 },
    hero: { width: 200, height: 160 },
    footer: { width: 120, height: 32 },
};

/**
 * Helix Brand Logo Component
 * 
 * Usage:
 * - Navbar: <BrandLogo variant="navbar" />
 * - Hero: <BrandLogo variant="hero" withGlow />
 * - Footer: <BrandLogo variant="footer" />
 */
export default function BrandLogo({
    variant = "navbar",
    width,
    height,
    withGlow = false,
    className = "",
}: BrandLogoProps) {
    const size = sizeMap[variant];
    const finalWidth = width ?? size.width;
    const finalHeight = height ?? size.height;

    return (
        <div className={`relative inline-flex items-center ${className}`}>
            {/* Glow effect for hero variant */}
            {withGlow && (
                <div
                    className="absolute inset-0 blur-2xl opacity-40"
                    style={{
                        background: "radial-gradient(circle, rgba(224, 86, 43, 0.6) 0%, rgba(198, 60, 60, 0.4) 50%, transparent 70%)",
                        transform: "scale(1.5)",
                    }}
                />
            )}

            <Image
                src="/logo.png"
                alt="Helix Logo"
                width={finalWidth}
                height={finalHeight}
                priority={variant === "navbar" || variant === "hero"}
                className={`relative z-10 object-contain mix-blend-multiply ${withGlow ? "drop-shadow-[0_0_30px_rgba(224,86,43,0.4)]" : ""}`}
                style={{
                    maxWidth: finalWidth,
                    height: "auto",
                }}
            />
        </div>
    );
}

/**
 * Brand Logo with Text (for navbar/footer)
 */
export function BrandLogoWithText({
    variant = "navbar",
    className = "",
}: {
    variant?: "navbar" | "footer";
    className?: string;
}) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <BrandLogo variant={variant} />
            <span className="text-xl font-bold text-white">Helix</span>
        </div>
    );
}
