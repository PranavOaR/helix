"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-violet-100 mb-8 max-w-lg mx-auto">
            Let&apos;s bring your vision to life. Get in touch with us today and
            start your journey to digital excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <Button className="bg-white text-violet-600 hover:bg-gray-100 gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
