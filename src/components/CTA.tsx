'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function CTA() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="contact" className="py-24">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-6"
            >
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600" />

                    {/* Animated Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div
                        animate={{
                            scale: [1.3, 1, 1.3],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
                    />

                    {/* Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 px-8 py-20 md:py-28 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight"
                        >
                            Ready to Build
                            <br />
                            Something Amazing?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
                        >
                            Let's bring your vision to life. Get in touch with us today and
                            start your journey to digital excellence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/auth">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-white text-purple-700 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-colors shadow-2xl"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-colors"
                            >
                                Schedule a Call
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
