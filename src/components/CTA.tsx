'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTA() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="contact" className="section bg-background-alt">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="container"
            >
                <div
                    className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                    style={{ background: 'var(--gradient-primary)' }}
                >
                    {/* Animated background circles */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute top-0 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl"
                    />

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold mb-6 text-white"
                        >
                            Ready to Build Something Amazing?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
                        >
                            Let's bring your vision to life. Get in touch with us today and
                            start your journey to digital excellence.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.4, type: 'spring' }}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-white text-purple-700 font-bold text-lg rounded-full hover:bg-gray-100 transition-colors"
                        >
                            Start Your Project
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
