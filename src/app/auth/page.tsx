'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle auth logic here
        console.log(isLogin ? 'Login' : 'Signup', { email, password, name });
    };

    const formVariants = {
        hidden: { opacity: 0, x: isLogin ? -20 : 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: 'easeOut' as const }
        },
        exit: {
            opacity: 0,
            x: isLogin ? 20 : -20,
            transition: { duration: 0.2 }
        }
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-0">
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent inline-block mb-2"
                            >
                                Helix
                            </motion.div>
                        </Link>
                        <h1 className="text-2xl font-semibold text-white mt-6 mb-2">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Sign up to get started with Helix'}
                        </p>
                    </div>

                    {/* Toggle Tabs */}
                    <div className="flex p-8 pb-0 gap-4">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${isLogin
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${!isLogin
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isLogin ? 'login' : 'signup'}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Name Field (Signup only) */}
                                {!isLogin && (
                                    <motion.div
                                        custom={0}
                                        variants={inputVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                        />
                                    </motion.div>
                                )}

                                {/* Email Field */}
                                <motion.div
                                    custom={isLogin ? 0 : 1}
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                    />
                                </motion.div>

                                {/* Password Field */}
                                <motion.div
                                    custom={isLogin ? 1 : 2}
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                    />
                                </motion.div>

                                {/* Forgot Password (Login only) */}
                                {isLogin && (
                                    <motion.div
                                        custom={2}
                                        variants={inputVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-right"
                                    >
                                        <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                            Forgot password?
                                        </a>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    custom={isLogin ? 3 : 3}
                                    variants={inputVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                                >
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </motion.button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-[#1a1a2e] text-gray-500">or continue with</span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { name: 'Google', icon: 'G' },
                                        { name: 'GitHub', icon: '◉' },
                                        { name: 'Apple', icon: '' },
                                    ].map((provider, index) => (
                                        <motion.button
                                            key={provider.name}
                                            custom={4 + index * 0.1}
                                            variants={inputVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            className="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-300"
                                        >
                                            <span className="text-lg">{provider.icon}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.form>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-500 text-sm mt-6"
                >
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Privacy Policy
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}
