'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { value: '100+', label: 'Projects Completed' },
    { value: '50+', label: 'Happy Clients' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
];

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="about" className="section bg-background-alt">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Crafting Digital Excellence Since{' '}
                            <span className="gradient-text">2020</span>
                        </h2>
                        <p className="text-foreground-muted text-lg mb-8 leading-relaxed">
                            We're a team of passionate designers and developers dedicated to
                            creating web experiences that not only look incredible but perform
                            flawlessly. Our mission is to help businesses stand out in the
                            digital landscape.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full font-semibold border-2 border-purple-500 hover:bg-purple-500/10 transition-colors"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                                whileHover={{ scale: 1.05 }}
                                className="glass rounded-2xl p-6 text-center"
                            >
                                <div className="text-4xl font-bold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-foreground-muted text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
