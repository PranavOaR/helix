'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        title: 'Lightning Fast',
        description: 'Built with performance in mind, delivering blazing-fast experiences that keep users engaged.',
        icon: '⚡',
        gradient: 'from-yellow-400 to-orange-500',
    },
    {
        title: 'Beautiful Design',
        description: 'Stunning interfaces crafted with attention to detail that captivate and delight your users.',
        icon: '✨',
        gradient: 'from-purple-400 to-pink-500',
    },
    {
        title: 'Fully Responsive',
        description: 'Perfect on any device, from mobile phones to desktop screens and everything in between.',
        icon: '📱',
        gradient: 'from-blue-400 to-cyan-500',
    },
    {
        title: 'Modern Stack',
        description: 'Leveraging cutting-edge technologies to build scalable, maintainable solutions.',
        icon: '🚀',
        gradient: 'from-green-400 to-emerald-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 80,
            damping: 15,
        },
    },
};

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="features" className="py-24 relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                        Features
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        Why Choose{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Helix
                        </span>
                        ?
                    </h2>
                    <p className="text-[#8b8b8b] text-lg max-w-2xl mx-auto">
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
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative bg-[#12121a]/60 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Icon */}
                            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="relative text-xl font-semibold mb-3 text-white">
                                {feature.title}
                            </h3>
                            <p className="relative text-[#8b8b8b] text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
