"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Helix transformed our digital presence completely. The results exceeded our expectations.",
    author: "Sarah Johnson",
    role: "CEO, TechCorp",
    initials: "SJ",
  },
  {
    quote:
      "Outstanding work! The team's attention to detail and creativity is unmatched.",
    author: "Michael Chen",
    role: "Founder, StartupXYZ",
    initials: "MC",
  },
  {
    quote:
      "Professional, efficient, and delivered exactly what we needed. Highly recommended.",
    author: "Emily Rodriguez",
    role: "Marketing Director",
    initials: "ER",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-medium text-violet-400 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What our clients say
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 hover:border-violet-500 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
