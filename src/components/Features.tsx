'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        title: 'Lightning Fast',
        description: 'Built with performance in mind, delivering blazing-fast experiences',
        icon: '⚡',
    },
    {
        title: 'Beautiful Design',
        description: 'Stunning interfaces that captivate and engage your users',
        icon: '✨',
    },
    {
        title: 'Fully Responsive',
        description: 'Perfect on any device, from mobile to desktop',
        icon: '📱',
    },
    {
        title: 'Modern Stack',
        description: 'Leveraging cutting-edge technologies for the best results',
        icon: '🚀',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 80,
        },
    },
};

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="features" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Why Choose <span className="gradient-text">Helix</span>?
                    </h2>
                    <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                        We combine cutting-edge technology with stunning design to deliver
                        exceptional digital experiences.
                    </p>
                </motion.div>

                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="glass rounded-2xl p-8 hover:shadow-2xl transition-shadow"
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-foreground-muted">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
