'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const testimonials = [
    {
        quote: "Helix transformed our digital presence. The results exceeded our expectations!",
        author: "Sarah Johnson",
        role: "CEO, TechCorp",
        avatar: "👩‍💼",
    },
    {
        quote: "Outstanding work! The team's attention to detail and creativity is unmatched.",
        author: "Michael Chen",
        role: "Founder, StartupXYZ",
        avatar: "👨‍💻",
    },
    {
        quote: "Professional, efficient, and delivered exactly what we needed. Highly recommend!",
        author: "Emily Rodriguez",
        role: "Marketing Director",
        avatar: "👩‍🎨",
    },
];

export default function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="testimonials" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        What Our <span className="gradient-text">Clients Say</span>
                    </h2>
                    <p className="text-foreground-muted text-lg">
                        Don't just take our word for it
                    </p>
                </motion.div>

                <div ref={ref} className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.15, type: 'spring' }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="glass rounded-2xl p-8 cursor-pointer"
                                onClick={() => setActiveIndex(index)}
                            >
                                <div className="text-6xl mb-6 text-center">{testimonial.avatar}</div>
                                <p className="text-foreground-muted mb-6 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="font-semibold">{testimonial.author}</div>
                                    <div className="text-sm text-foreground-muted">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
