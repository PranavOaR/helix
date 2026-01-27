'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const footerLinks = {
    Product: ['Features', 'Pricing', 'Testimonials', 'FAQ'],
    Company: ['About', 'Team', 'Careers', 'Contact'],
    Resources: ['Blog', 'Documentation', 'Support', 'Community'],
};

const socialLinks = [
    { icon: '𝕏', label: 'Twitter' },
    { icon: 'in', label: 'LinkedIn' },
    { icon: 'f', label: 'Facebook' },
    { icon: 'ig', label: 'Instagram' },
];

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <footer className="bg-background border-t border-white/10">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="container py-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="text-3xl font-bold gradient-text mb-4">Helix</div>
                        <p className="text-foreground-muted mb-6 max-w-xs">
                            Crafting digital experiences that inspire and engage.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ scale: 1.2, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                        <div key={category}>
                            <h3 className="font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: (categoryIndex * links.length + linkIndex) * 0.03 }}
                                    >
                                        <a
                                            href="#"
                                            className="text-foreground-muted hover:text-foreground transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-foreground-muted text-sm">
                        © 2024 Helix. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
