'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { value: '100+', label: 'Projects Delivered', icon: '🎯' },
    { value: '50+', label: 'Happy Clients', icon: '💜' },
    { value: '99%', label: 'Satisfaction Rate', icon: '⭐' },
    { value: '24/7', label: 'Support Available', icon: '🛡️' },
];

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            About Us
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Crafting Digital Excellence Since{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                2020
                            </span>
                        </h2>
                        <p className="text-[#8b8b8b] text-lg mb-8 leading-relaxed">
                            We're a team of passionate designers and developers dedicated to
                            creating web experiences that not only look incredible but perform
                            flawlessly. Our mission is to help businesses stand out in the
                            digital landscape.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                            >
                                Learn More
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 rounded-xl font-semibold border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Our Story
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 gap-5"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: index * 0.1 + 0.3, type: 'spring' as const }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group relative bg-[#12121a]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                            >
                                {/* Background Glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Icon */}
                                <div className="relative text-3xl mb-3">{stat.icon}</div>

                                {/* Value */}
                                <div className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="relative text-[#8b8b8b] text-sm">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
