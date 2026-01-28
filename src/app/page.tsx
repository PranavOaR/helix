"use client";

import { motion, type Variants } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  Globe,
  Palette,
  Brush,
  Smartphone,
  Image as ImageIcon,
  UserPlus,
  FileText,
  CheckCircle,
  Eye,
  Zap,
  Headphones,
  Clock,
  Award,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Animation variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Custom hook for parallax scroll effect with smoothstep easing
function useParallax(speed: number = 0.5, maxOffset: number = 150) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smoothstep easing function for premium feel
  const smoothstep = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped * clamped * (3 - 2 * clamped);
  };

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          if (!ref.current) {
            ticking = false;
            return;
          }

          const element = ref.current;
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how far through the viewport the element is
          // 0 = element just entering viewport from bottom
          // 1 = element just leaving viewport from top
          const rawProgress = Math.min(
            Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0),
            1
          );

          // Apply smoothstep for non-linear, premium motion
          const easedProgress = smoothstep(rawProgress);
          setScrollProgress(easedProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calculate transform values with larger range for visible parallax
  // Center around 0.5 so elements move in both directions
  const translateY = (scrollProgress - 0.5) * 2 * maxOffset * speed;

  return { ref, scrollProgress, translateY };
}

// ============================================
// NAVBAR
// ============================================
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tangerine to-rose flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-white">Helix</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#why-helix" className="text-sm text-slate-400 hover:text-white transition-colors">
              Why Helix
            </a>
            <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">
              Testimonials
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth" className="px-4 py-2 bg-tangerine hover:bg-tangerine-light text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-tangerine/25">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// HERO SECTION - Premium Multi-Layer Parallax System
// ============================================
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll parallax state
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse parallax state (with smooth trailing)
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  // Idle floating animation state
  const [floatX, setFloatX] = useState(0);
  const [floatY, setFloatY] = useState(0);
  const startTimeRef = useRef(Date.now());

  // Utility functions
  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const smoothstep = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped * clamped * (3 - 2 * clamped);
  };

  // Check if touch device
  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Single unified animation loop for all effects
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const element = heroRef.current;

      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const heroHeight = element.offsetHeight;

        // Scroll progress calculation (0 to 1)
        const rawProgress = clamp(window.scrollY / heroHeight, 0, 1);
        const easedProgress = smoothstep(rawProgress);
        setScrollProgress(easedProgress);
        setScrollY((easedProgress - 0.5) * 200);
      }

      // Mouse parallax lerp (smooth trailing)
      if (!isTouchDevice()) {
        mouseCurrentRef.current.x = lerp(mouseCurrentRef.current.x, mouseTargetRef.current.x, 0.06);
        mouseCurrentRef.current.y = lerp(mouseCurrentRef.current.y, mouseTargetRef.current.y, 0.06);
        setMouseX(mouseCurrentRef.current.x);
        setMouseY(mouseCurrentRef.current.y);
      }

      // Idle float calculation (sine waves with phase offset)
      const elapsed = Date.now() - startTimeRef.current;
      setFloatX(Math.sin(elapsed * 0.0006) * 15);
      setFloatY(Math.sin(elapsed * 0.0008 + Math.PI / 3) * 18);

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || isTouchDevice()) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -1 to 1 range
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Apply intensity (40px max movement)
      mouseTargetRef.current.x = clamp(normalizedX * 40, -50, 50);
      mouseTargetRef.current.y = clamp(normalizedY * 30, -40, 40);
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current.x = 0;
      mouseTargetRef.current.y = 0;
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Layer transform generator
  const getLayerTransform = (config: {
    scrollStrength?: number;
    mouseStrength?: number;
    floatStrength?: number;
    scale?: number;
  }) => {
    const { scrollStrength = 0.5, mouseStrength = 0.5, floatStrength = 0.5, scale } = config;

    const finalX = mouseX * mouseStrength + floatX * floatStrength;
    const finalY = scrollY * scrollStrength + mouseY * mouseStrength + floatY * floatStrength;

    let transform = `translate3d(${finalX}px, ${finalY}px, 0)`;

    if (scale !== undefined) {
      const scaleValue = 1 - scrollProgress * scale;
      transform += ` scale(${clamp(scaleValue, 0.8, 1.05)})`;
    }

    return transform;
  };

  // Calculate opacity based on scroll
  const contentOpacity = clamp(1 - scrollProgress * 1.3, 0, 1);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* ==========================================
          LAYER 1: Far Background Glow (Slowest)
          ========================================== */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          transform: getLayerTransform({
            scrollStrength: 0.2,
            mouseStrength: 0.15,
            floatStrength: 0.3,
          }),
          willChange: 'transform',
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-tangerine/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-rose/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/10 rounded-full blur-[200px]" />
      </div>

      {/* ==========================================
          LAYER 2: Mid Decorative Shapes
          ========================================== */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          transform: getLayerTransform({
            scrollStrength: 0.35,
            mouseStrength: 0.25,
            floatStrength: 0.5,
          }),
          willChange: 'transform',
        }}
      >
        {/* Abstract rings */}
        <div className="absolute top-20 right-[15%] w-[300px] h-[300px] rounded-full border border-tangerine/20" />
        <div className="absolute bottom-32 left-[10%] w-[200px] h-[200px] rounded-full border border-rose/15" />
        <div className="absolute top-[40%] right-[5%] w-[150px] h-[150px] rounded-full border border-white/5" />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 right-[20%] w-[100px] h-[100px] bg-gradient-to-br from-tangerine/30 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-1/3 left-[15%] w-[80px] h-[80px] bg-gradient-to-br from-rose/25 to-transparent rounded-full blur-lg" />
      </div>

      {/* Grid Pattern (Static) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* ==========================================
          LAYER 3: Main Content (Medium Movement)
          ========================================== */}
      <div
        className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 z-10"
        style={{
          transform: getLayerTransform({
            scrollStrength: 0.5,
            mouseStrength: 0.08,
            floatStrength: 0.1,
            scale: 0.12,
          }),
          opacity: contentOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
              <span className="w-2 h-2 bg-tangerine rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Now accepting new brands</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Build. Launch. Scale
              <br />
              <span className="bg-gradient-to-r from-tangerine via-tangerine-light to-rose bg-clip-text text-transparent">
                Your Brand with Helix.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Helix is your all-in-one platform to request creative services and track projects seamlessly. From websites to branding, we&apos;ve got you covered.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-tangerine to-rose text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-tangerine/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                View Services
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* ==========================================
              LAYER 4: Foreground Floating Elements
              ========================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[450px] h-[450px]">
              {/* Outer Ring - Very slow movement */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/10"
                style={{
                  transform: `translate3d(${mouseX * 0.1}px, ${mouseY * 0.1 + floatY * 0.3}px, 0) rotate(${scrollProgress * 30}deg)`,
                  willChange: 'transform',
                }}
              />

              {/* Middle Ring - Medium movement */}
              <div
                className="absolute inset-8 rounded-full border border-tangerine/30"
                style={{
                  transform: `translate3d(${mouseX * 0.2}px, ${mouseY * 0.2 + floatY * 0.5}px, 0)`,
                  willChange: 'transform',
                }}
              />

              {/* Inner Glow */}
              <div
                className="absolute inset-16 rounded-full bg-gradient-to-br from-tangerine/20 to-rose/20 blur-xl"
                style={{
                  transform: `translate3d(${mouseX * 0.15}px, ${mouseY * 0.15 + floatY * 0.4}px, 0)`,
                  willChange: 'transform',
                }}
              />

              {/* Center Logo */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate3d(${mouseX * 0.05}px, ${mouseY * 0.05}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-tangerine to-rose flex items-center justify-center shadow-2xl shadow-tangerine/30">
                  <span className="text-white font-bold text-5xl">H</span>
                </div>
              </div>

              {/* Floating Icon 1 - Fast movement */}
              <div
                className="absolute top-20 right-16 w-12 h-12 rounded-xl bg-navy-light border border-white/10 flex items-center justify-center"
                style={{
                  transform: `translate3d(${mouseX * 0.6 + floatX * 0.8}px, ${mouseY * 0.6 + floatY * 1.2}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <Globe className="w-6 h-6 text-tangerine" />
              </div>

              {/* Floating Icon 2 - Medium-fast movement */}
              <div
                className="absolute bottom-24 left-12 w-12 h-12 rounded-xl bg-navy-light border border-white/10 flex items-center justify-center"
                style={{
                  transform: `translate3d(${mouseX * 0.5 - floatX * 0.6}px, ${mouseY * 0.5 - floatY * 1}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <Palette className="w-6 h-6 text-rose" />
              </div>

              {/* Floating Icon 3 - Different movement pattern */}
              <div
                className="absolute top-1/2 right-4 w-12 h-12 rounded-xl bg-navy-light border border-white/10 flex items-center justify-center"
                style={{
                  transform: `translate3d(${mouseX * 0.7 + floatX * 0.5}px, ${mouseY * 0.7 - floatY * 0.8}px, 0)`,
                  willChange: 'transform',
                }}
              >
                <Smartphone className="w-6 h-6 text-tangerine-light" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRUST / SOCIAL PROOF SECTION
// ============================================
function TrustSection() {
  const brands = ["TechFlow", "Brandify", "StartupX", "DesignCo", "LaunchPad"];
  const { ref, translateY } = useParallax(0.3);

  return (
    <section className="py-16 border-y border-white/5 bg-navy/30 overflow-hidden">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center"
        >
          <p className="text-sm text-slate-500 mb-8 uppercase tracking-wider">
            Trusted by growing brands worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-slate-700 hover:text-slate-500 transition-colors cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SERVICES SECTION
// ============================================
function ServicesSection() {
  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Custom, responsive websites built with modern technologies for optimal performance and user experience.",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Intuitive interfaces and seamless experiences that delight users and drive conversions.",
    },
    {
      icon: Brush,
      title: "Branding & Identity",
      description: "Memorable brand identities that tell your story and connect with your target audience.",
    },
    {
      icon: Smartphone,
      title: "App Development",
      description: "Native and cross-platform mobile applications that engage users on any device.",
    },
    {
      icon: ImageIcon,
      title: "Canva & Social Creatives",
      description: "Eye-catching social media graphics and marketing materials that stand out.",
    },
  ];

  const { ref, translateY } = useParallax(0.4);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Parallax Background Element */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${translateY * 0.5}px)`,
          willChange: 'transform'
        }}
      >
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-tangerine/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-rose/5 rounded-full blur-[100px]" />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-tangerine mb-4 uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Services We Provide
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to build and grow your brand, all in one place.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-8 bg-navy-light/50 border border-white/5 rounded-2xl hover:border-tangerine/30 hover:bg-navy-light/80 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-tangerine/20 to-rose/20 border border-tangerine/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-tangerine" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Register Your Brand",
      description: "Create your brand account in minutes. Tell us about your business and goals.",
      icon: UserPlus,
    },
    {
      step: "02",
      title: "Request Any Service",
      description: "Choose from our range of services and submit your project requirements.",
      icon: FileText,
    },
    {
      step: "03",
      title: "Track & Receive Delivery",
      description: "Monitor progress in real-time and receive your completed project on time.",
      icon: CheckCircle,
    },
  ];

  const { ref, translateY, scrollProgress } = useParallax(0.5);

  return (
    <section id="how-it-works" className="py-24 bg-navy/30 overflow-hidden relative">
      {/* Parallax Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-[300px] h-[300px] bg-tangerine/10 rounded-full blur-[100px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -80}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-[250px] h-[250px] bg-rose/10 rounded-full blur-[80px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * 60}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -40}px) translateX(-50%)`,
            willChange: 'transform'
          }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-tangerine mb-4 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            A Simple Workflow Built for Brands
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get started in three easy steps and watch your brand come to life.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-tangerine/50 to-transparent" />
              )}

              <div className="relative p-8 bg-gradient-to-br from-navy-light/80 to-navy-light/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-tangerine/20 transition-all">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-tangerine/5 to-rose/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-tangerine to-rose bg-clip-text text-transparent">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-tangerine/10 border border-tangerine/20 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-tangerine" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROJECT TRACKING SECTION
// ============================================
function ProjectTrackingSection() {
  const statuses = [
    { label: "Submitted", icon: "✅", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "In Progress", icon: "🟡", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Review", icon: "🔵", color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Completed", icon: "✅", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  const { ref, translateY, scrollProgress } = useParallax(0.4);

  return (
    <section className="py-24 overflow-hidden">
      {/* Parallax Background Elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${translateY * 0.3}px)`,
          willChange: 'transform'
        }}
      >
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-tangerine/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose/5 rounded-full blur-[120px]" />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="inline-block text-sm font-medium text-tangerine mb-4 uppercase tracking-wider">
              Real-Time Tracking
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Track every stage of your project in real-time
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Stay informed with our intuitive dashboard. Know exactly where your project stands, from submission to completion. No more wondering, no more waiting blindly.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <Eye className="w-5 h-5 text-tangerine" />
                <span>Real-time status updates</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Zap className="w-5 h-5 text-tangerine" />
                <span>Instant notifications</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Headphones className="w-5 h-5 text-tangerine" />
                <span>Direct communication channel</span>
              </li>
            </ul>
          </motion.div>

          {/* Right - Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
            style={{
              transform: `translateY(${(scrollProgress - 0.5) * -20}px)`,
              willChange: 'transform'
            }}
          >
            <div className="p-8 bg-navy-light border border-white/10 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Project Status</h3>
                <span className="text-xs text-slate-500">Updated just now</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>
                  <span className="text-tangerine font-medium">75%</span>
                </div>
                <div className="h-3 bg-navy rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-tangerine to-rose rounded-full"
                  />
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-4">
                {statuses.map((status, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl ${status.bg} border border-white/5`}
                  >
                    <span className="text-xl">{status.icon}</span>
                    <span className={`font-medium ${status.color}`}>{status.label}</span>
                    {index < 2 && (
                      <span className="ml-auto text-xs text-slate-500">Completed</span>
                    )}
                    {index === 2 && (
                      <span className="ml-auto text-xs text-blue-400">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-tangerine/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// WHY HELIX SECTION
// ============================================
function WhyHelixSection() {
  const benefits = [
    {
      icon: Eye,
      title: "Transparent Workflow",
      description: "See every step of your project with complete visibility into our process.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Get personalized assistance from our team whenever you need it.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising on quality.",
    },
    {
      icon: Award,
      title: "Premium Quality Design",
      description: "World-class designs that elevate your brand above the competition.",
    },
  ];

  const { ref, translateY, scrollProgress } = useParallax(0.5);

  return (
    <section id="why-helix" className="py-24 bg-navy/30 overflow-hidden relative">
      {/* Parallax Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 right-20 w-[350px] h-[350px] bg-tangerine/10 rounded-full blur-[100px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -100}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute bottom-10 left-20 w-[280px] h-[280px] bg-rose/10 rounded-full blur-[90px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * 80}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-blue-500/5 rounded-full blur-[80px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -50}px)`,
            willChange: 'transform'
          }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-tangerine mb-4 uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Brands Choose Helix
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We&apos;re committed to delivering exceptional results that help your brand thrive.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="text-center p-8 bg-navy-light/50 border border-white/5 rounded-2xl hover:border-tangerine/30 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tangerine/20 to-rose/20 border border-tangerine/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-8 h-8 text-tangerine" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      brand: "TechFlow Inc",
      review: "Helix transformed our brand identity completely. The team delivered beyond our expectations with incredible attention to detail.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      brand: "StartupX",
      review: "The project tracking feature is a game-changer. We always knew exactly where our project stood. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      brand: "DesignCo",
      review: "Fast delivery, premium quality, and excellent communication. Helix is now our go-to partner for all creative needs.",
      rating: 5,
    },
  ];

  const { ref, translateY, scrollProgress } = useParallax(0.5);

  return (
    <section id="testimonials" className="py-24 overflow-hidden relative">
      {/* Parallax Background Elements - More Visible */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-10 w-[400px] h-[400px] bg-tangerine/10 rounded-full blur-[100px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -120}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-rose/10 rounded-full blur-[90px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * 100}px)`,
            willChange: 'transform'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]"
          style={{
            transform: `translateY(${(scrollProgress - 0.5) * -60}px) translateX(-50%)`,
            willChange: 'transform'
          }}
        />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-tangerine mb-4 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with Helix.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="p-8 bg-navy-light/50 border border-white/5 rounded-2xl hover:border-tangerine/30 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-tangerine text-tangerine" />
                ))}
              </div>

              {/* Review */}
              <p className="text-slate-300 mb-6 leading-relaxed">&ldquo;{testimonial.review}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tangerine to-rose flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.brand}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA SECTION
// ============================================
function FinalCTASection() {
  const { ref, translateY } = useParallax(0.25);

  return (
    <section className="py-24 overflow-hidden">
      <div
        ref={ref}
        className="max-w-5xl mx-auto px-6 lg:px-8"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative p-12 sm:p-16 bg-gradient-to-br from-tangerine via-rose to-tangerine rounded-3xl overflow-hidden text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Build Your Brand with Helix?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of growing brands who trust Helix for their creative needs.
            </p>
            <Link href="/auth" className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
              Create Your Brand Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-navy/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tangerine to-rose flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-white">Helix</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
              Services
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Helix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <Hero />
      <TrustSection />
      <ServicesSection />
      <HowItWorksSection />
      <ProjectTrackingSection />
      <WhyHelixSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
