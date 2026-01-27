'use client';

import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
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
        },
    },
};

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Gradient */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0 -z-10"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(130, 96, 230, 0.2) 0%, transparent 70%)',
                }}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container text-center z-10"
            >
                {/* Main Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-bold mb-6"
                >
                    Build the Future with{' '}
                    <span className="gradient-text">Helix</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-foreground-muted mb-12 max-w-3xl mx-auto"
                >
                    We create stunning, animated experiences that captivate your audience
                    and drive real results.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full font-semibold text-white text-lg"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        Start Your Project
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/10 transition-colors"
                    >
                        View Our Work
                    </motion.button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
