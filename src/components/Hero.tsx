"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-gray-950">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Now in Beta</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
          Build beautiful websites
          <br />
          <span className="text-violet-400">faster than ever</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          We create stunning, animated experiences that captivate your audience
          and drive real results. Transform your vision into reality.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth">
            <Button variant="primary" size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            View Demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-950 flex items-center justify-center text-xs font-medium text-white"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">1,000+</span> teams already using Helix
          </div>
        </div>
      </div>
    </section>
  );
}
