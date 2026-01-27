'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-[100px]"
                />
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container text-center z-10 max-w-5xl mx-auto px-6"
            >
                {/* Badge */}
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Now in Beta — Join thousands of early adopters
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight"
                >
                    Build the Future
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                        with Helix
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-[#8b8b8b] mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    We create stunning, animated experiences that captivate your audience
                    and drive real results. Transform your vision into reality.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/auth">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-2xl font-semibold text-white text-lg bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                        >
                            Start Your Project
                        </motion.button>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-2xl font-semibold border border-white/15 text-gray-200 hover:text-white transition-all"
                    >
                        View Our Work
                    </motion.button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
                >
                    <div className="flex -space-x-3">
                        {['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'].map((color, i) => (
                            <div
                                key={i}
                                className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-sm font-medium text-white"
                                style={{ backgroundColor: color }}
                            >
                                {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="text-white font-semibold">Trusted by 1,000+ teams</div>
                        <div className="text-sm text-gray-500">From startups to Fortune 500</div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-white/40 rounded-full"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
