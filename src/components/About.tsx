"use client";

const stats = [
  { value: "100+", label: "Projects" },
  { value: "50+", label: "Clients" },
  { value: "99%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-navy-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text */}
          <div>
            <span className="inline-block text-sm font-medium text-brand-orange mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Crafting digital excellence since 2020
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              We&apos;re a team of passionate designers and developers dedicated to
              creating web experiences that not only look incredible but perform
              flawlessly. Our mission is to help businesses stand out in the
              digital landscape.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-brand-orange text-white text-sm font-medium rounded-lg hover:bg-brand-orange-deep transition-colors">
                Learn More
              </button>
              <button className="px-6 py-2.5 border border-white/10 text-white/80 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">
                Our Story
              </button>
            </div>
          </div>

          {/* Right column - Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-brand-navy border-2 border-white/5 rounded-xl p-6 text-center hover:border-brand-orange transition-colors"
              >
                <div className="text-3xl font-bold text-brand-orange-light mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
