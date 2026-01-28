"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-helix", label: "Why Helix" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-brand-navy hover:text-brand-orange transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-brand-navy/10">
                <span className="text-lg font-bold text-brand-navy">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-brand-navy hover:text-brand-orange transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-brand-navy hover:text-brand-orange hover:bg-brand-navy/5 rounded-lg transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="my-6 border-t border-brand-navy/10" />

                {/* Auth Links */}
                <div className="space-y-3">
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-brand-navy hover:text-brand-orange hover:bg-brand-navy/5 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-gradient-to-r from-brand-orange to-brand-red-light text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-brand-orange/30 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
