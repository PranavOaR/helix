'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
    {
        quote: "Helix transformed our digital presence completely. The results exceeded our wildest expectations and our conversion rates doubled!",
        author: "Sarah Johnson",
        role: "CEO, TechCorp",
        avatar: "SJ",
        color: "#8b5cf6",
    },
    {
        quote: "Outstanding work! The team's attention to detail and creativity is unmatched. They truly understand modern web design.",
        author: "Michael Chen",
        role: "Founder, StartupXYZ",
        avatar: "MC",
        color: "#3b82f6",
    },
    {
        quote: "Professional, efficient, and delivered exactly what we needed. The animations and performance are absolutely incredible!",
        author: "Emily Rodriguez",
        role: "Marketing Director",
        avatar: "ER",
        color: "#06b6d4",
    },
];

export default function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="testimonials" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        What Our{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Clients Say
                        </span>
                    </h2>
                    <p className="text-[#8b8b8b] text-lg max-w-xl mx-auto">
                        Don't just take our word for it. Here's what our clients have to say about working with us.
                    </p>
                </motion.div>

                <div ref={ref} className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.15, type: 'spring' as const, stiffness: 80 }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative bg-[#12121a]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                        >
                            {/* Quote Icon */}
                            <div className="text-4xl text-purple-500/20 mb-4">"</div>

                            {/* Quote */}
                            <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                                {testimonial.quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                    style={{ backgroundColor: testimonial.color }}
                                >
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.author}</div>
                                    <div className="text-sm text-[#8b8b8b]">{testimonial.role}</div>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="absolute top-8 right-8 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-sm">★</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
