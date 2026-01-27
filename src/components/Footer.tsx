'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    Company: ['About', 'Careers', 'Blog', 'Press'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

const socialLinks = [
    { icon: '𝕏', label: 'Twitter', href: '#' },
    { icon: 'in', label: 'LinkedIn', href: '#' },
    { icon: '▶', label: 'YouTube', href: '#' },
    { icon: '◉', label: 'GitHub', href: '#' },
];

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <footer className="bg-[#08080c] border-t border-white/5">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-6 py-16"
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2">
                        <Link href="/">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 inline-block">
                                Helix
                            </div>
                        </Link>
                        <p className="text-[#8b8b8b] mb-6 max-w-xs text-sm leading-relaxed">
                            Crafting digital experiences that inspire, engage, and drive real results for ambitious brands.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 flex items-center justify-center transition-all text-gray-400 hover:text-white"
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
                            <h3 className="font-semibold text-white mb-4 text-sm">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: (categoryIndex * links.length + linkIndex) * 0.02 }}
                                    >
                                        <a
                                            href="#"
                                            className="text-[#8b8b8b] hover:text-white transition-colors text-sm"
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
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#8b8b8b] text-sm">
                        © 2024 Helix. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="text-[#8b8b8b] hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-[#8b8b8b] hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-[#8b8b8b] hover:text-white transition-colors">
                            Cookies
                        </a>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
