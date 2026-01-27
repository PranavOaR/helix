'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent cursor-pointer"
            >
              Helix
            </motion.div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'About', 'Testimonials', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2, color: '#f5f5f7' }}
                className="text-[#8b8b8b] hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/auth">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 shadow-lg shadow-purple-500/20"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
