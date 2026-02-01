"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Why helix", href: "#why-helix" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "top-2" : "top-4"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex items-center justify-between h-16 px-6 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isScrolled 
              ? "bg-[#0A1428]/95 border-[#499BD9]/30 shadow-[0_0_20px_rgba(73,155,217,0.2)]" 
              : "bg-[#0A1428]/80 border-[#123A9C]/30"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BrandLogo variant="navbar" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-300 hover:text-[#EFA163] transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <Link href="/auth">
              <Button 
                className="bg-gradient-to-r from-[#E0562B] to-[#C9471F] hover:from-[#C9471F] hover:to-[#89100D] text-white font-semibold px-6 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,86,43,0.4)]"
                size="sm"
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 py-4 px-6 rounded-3xl bg-[#0A1428]/95 backdrop-blur-md border border-[#123A9C]/30">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-[#EFA163] transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-[#123A9C]/30">
                <Link href="/auth">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#E0562B] to-[#C9471F] hover:from-[#C9471F] hover:to-[#89100D] text-white font-semibold rounded-full"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
