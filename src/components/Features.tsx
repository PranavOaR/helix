"use client";

import { Zap, Palette, Smartphone, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built with performance in mind, delivering blazing-fast experiences.",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description:
      "Stunning interfaces crafted with attention to detail.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Perfect on any device, from mobile phones to desktops.",
  },
  {
    icon: Rocket,
    title: "Modern Stack",
    description:
      "Leveraging cutting-edge technologies to build scalable solutions.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-medium text-violet-400 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why choose Helix?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We combine cutting-edge technology with stunning design to deliver
            exceptional digital experiences.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 hover:border-violet-500 transition-colors"
            >
              <div className="w-12 h-12 bg-violet-600/30 border border-violet-500/50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
