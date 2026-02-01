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
import { IconBriefcase, IconRoute, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import { NavDock, NavDockMobile } from "@/components/ui/nav-dock";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import MobileMenu from "@/components/MobileMenu";
import { ExpandableCard } from "@/components/ui/expandable-card";

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
  const navItems = [
    {
      title: "Services",
      icon: <IconBriefcase className="h-full w-full" />,
      href: "#services",
    },
    {
      title: "How It Works",
      icon: <IconRoute className="h-full w-full" />,
      href: "#how-it-works",
    },
    {
      title: "Why Helix",
      icon: <IconSparkles className="h-full w-full" />,
      href: "#why-helix",
    },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-navy/5"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Helix - Home">
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={32}
              priority
              className="object-contain mix-blend-multiply"
            />
            <span className="text-xl font-bold text-brand-navy">Helix</span>
          </Link>

          {/* Nav Dock - Center (Desktop) */}
          <NavDock items={navItems} />

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
              Sign In
            </Link>
            <Link
              href="/auth"
              className="hidden sm:block px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-red-light text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-brand-orange/25 hover:scale-105"
            >
              Get Started
            </Link>
            <NavDockMobile items={navItems} />
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-32 bg-white"
    >

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
            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight mb-6"
            >
              Build. Launch. Scale
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-orange-light to-brand-red-light bg-clip-text text-transparent">
                Your Brand with Helix.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="text-lg text-brand-navy/70 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Helix is your all-in-one platform to request creative services and track projects seamlessly. From websites to branding, we&apos;ve got you covered.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-red-light text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-brand-orange/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-brand-navy/5 border border-brand-navy/10 text-brand-navy font-semibold rounded-xl hover:bg-brand-navy/10 transition-all flex items-center justify-center gap-2">
                View Services
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* ==========================================
              LAYER 4: Static Helix Logo (Clean & Minimal)
              ========================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              {/* Subtle glow behind logo */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-brand-orange/20 to-brand-red-light/15 rounded-full blur-3xl" />
              <Image
                src="/logo.png"
                alt="Helix Logo"
                width={200}
                height={200}
                priority
                className="relative z-10 object-contain"
              />
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
  const { ref, translateY } = useParallax(0.6); // Increased speed

  return (
    <section ref={ref} className="py-24 border-y border-white/5 bg-black relative overflow-hidden">
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-50"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px]" />
      </div>

      {/* Layer 2: Content (Normal parallax) */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
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
          <p className="text-sm text-white/40 mb-12 uppercase tracking-widest font-medium">
            Trusted by growing brands worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-white hover:text-brand-orange-light transition-colors cursor-default"
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
// Service type extended for CardStack
interface ServiceItem extends CardStackItem {
  icon: React.ElementType;
  category: string;
  details: {
    description: string;
    features: string[];
    process: string;
  };
}

function ServicesSection() {
  const services: ServiceItem[] = [
    {
      id: 1,
      icon: Globe,
      title: "Website Development",
      category: "Development",
      description: "Custom, responsive websites built with modern technologies for optimal performance and user experience.",
      imageSrc: "/images/webdev.png",
      details: {
        description: "We build lightning-fast, SEO-optimized websites that convert visitors into customers.",
        features: [
          "Custom Next.js & React Development",
          "E-commerce Solutions with Shopify or Custom",
          "CMS Integration (Contentful, Sanity, WordPress)",
          "Performance Optimization & Core Web Vitals",
          "Responsive Design for All Devices",
        ],
        process: "Our development process starts with understanding your business goals. We then create wireframes, design mockups, and develop your site with clean, maintainable code.",
      },
    },
    {
      id: 2,
      icon: Palette,
      title: "UI/UX Design",
      category: "Design",
      description: "Intuitive interfaces and seamless experiences that delight users and drive conversions.",
      imageSrc: "/images/uiux.jpg",
      details: {
        description: "Create memorable digital experiences with user-centered design that drives engagement and conversions.",
        features: [
          "User Research & Persona Development",
          "Wireframing & Prototyping in Figma",
          "Visual Design & Design Systems",
          "Usability Testing & Iteration",
          "Interaction Design & Micro-animations",
        ],
        process: "We dive deep into understanding your users through research and testing. Our iterative design process ensures every interface is intuitive and accessible.",
      },
    },
    {
      id: 3,
      icon: Brush,
      title: "Branding & Identity",
      category: "Branding",
      description: "Memorable brand identities that tell your story and connect with your target audience.",
      imageSrc: "/images/brand.jpg",
      details: {
        description: "Build a brand that resonates with your audience and stands out in a crowded market.",
        features: [
          "Logo Design & Visual Identity",
          "Brand Strategy & Positioning",
          "Color Palette & Typography Systems",
          "Brand Guidelines & Style Guides",
          "Marketing Collateral Design",
        ],
        process: "We start with discovery sessions to understand your vision, values, and target audience. From there, we craft a cohesive brand identity.",
      },
    },
    {
      id: 4,
      icon: Smartphone,
      title: "App Development",
      category: "Development",
      description: "Native and cross-platform mobile applications that engage users on any device.",
      imageSrc: "/images/app.png",
      details: {
        description: "Launch powerful mobile applications that your users will love and keep coming back to.",
        features: [
          "iOS & Android Native Development",
          "React Native Cross-Platform Apps",
          "App Store Optimization & Submission",
          "Push Notifications & Real-time Features",
          "Backend API Development & Integration",
        ],
        process: "From concept to launch, we guide you through the entire app development lifecycle with focus on performance and scalability.",
      },
    },
    {
      id: 5,
      icon: ImageIcon,
      title: "Canva & Social Creatives",
      category: "Marketing",
      description: "Eye-catching social media graphics and marketing materials that stand out.",
      imageSrc: "/images/canva.jpg",
      details: {
        description: "Elevate your social media presence with scroll-stopping graphics and cohesive visual content.",
        features: [
          "Social Media Post Templates",
          "Instagram Stories & Reels Graphics",
          "LinkedIn & Twitter Banner Designs",
          "Email Marketing Templates",
          "Presentation & Pitch Deck Design",
        ],
        process: "We create a library of on-brand templates and assets that make it easy for your team to produce consistent, professional content.",
      },
    },
  ];

  const { ref, translateY } = useParallax(0.8);

  return (
    <section id="services" ref={ref} className="pt-32 pb-48 relative overflow-hidden bg-black rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[2] section-black-overlap">
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`,
          willChange: 'transform'
        }}
      >
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-brand-red-light/10 rounded-full blur-[140px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-bold text-brand-orange mb-4 uppercase tracking-widest">
            Our Services
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Services We Provide
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to build and grow your brand. Click any service to learn more.
          </p>
        </motion.div>

        {/* CardStack for Services - with expandable cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <CardStack
            items={services}
            initialIndex={0}
            autoAdvance
            intervalMs={3500}
            pauseOnHover
            showDots
            cardWidth={420}
            cardHeight={320}
            maxVisible={5}
            overlap={0.5}
            spreadDeg={35}
            activeScale={1.05}
            inactiveScale={0.9}
            expandable
          />
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

  const { ref, translateY, scrollProgress } = useParallax(1.0); // Speed 1.0

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="pt-32 pb-48 bg-white relative overflow-hidden rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[3] section-white-overlap"
    >
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-brand-red-light/10 rounded-full blur-[140px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: 'transform'
        }}
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-bold text-brand-orange mb-4 uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-navy mb-6">
            A Simple Workflow Built for Brands
          </h2>
          <p className="text-xl text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
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
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-orange/50 to-transparent" />
              )}

              <div className="relative p-10 bg-brand-navy/5 border border-brand-navy/10 rounded-3xl overflow-hidden group hover:border-brand-orange/30 transition-all shadow-lg hover:shadow-brand-orange/10">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-red-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-5xl font-bold bg-gradient-to-r from-brand-orange to-brand-red-light bg-clip-text text-transparent">
                      {step.step}
                    </span>
                    <div className="w-14 h-14 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-brand-orange" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-brand-navy mb-4">{step.title}</h3>
                  <p className="text-brand-navy/60 leading-relaxed text-lg">{step.description}</p>
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
    { label: "Submitted", dotColor: "bg-emerald-500", color: "text-brand-navy-light", bg: "bg-brand-navy-light/10" },
    { label: "In Progress", dotColor: "bg-amber-500", color: "text-brand-orange", bg: "bg-brand-orange/10" },
    { label: "Review", dotColor: "bg-blue-500", color: "text-brand-orange-light", bg: "bg-brand-orange-light/10" },
    { label: "Completed", dotColor: "bg-brand-orange", color: "text-brand-red-light", bg: "bg-brand-red-light/10" },
  ];

  const { ref, translateY, scrollProgress } = useParallax(0.4);

  return (
    <section
      ref={ref}
      className="pt-24 pb-40 overflow-hidden bg-black relative rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[4] section-black-overlap"
    >
      {/* Parallax Background Elements */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-brand-red-light/5 rounded-full blur-[140px]" />
      </div>

      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
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
            <span className="inline-block text-sm font-medium text-brand-orange mb-4 uppercase tracking-wider">
              Real-Time Tracking
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Track every stage of your project in real-time
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Stay informed with our intuitive dashboard. Know exactly where your project stands, from submission to completion. No more wondering, no more waiting blindly.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80">
                <Eye className="w-5 h-5 text-brand-orange" />
                <span>Real-time status updates</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Zap className="w-5 h-5 text-brand-orange" />
                <span>Instant notifications</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Headphones className="w-5 h-5 text-brand-orange" />
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
              transform: `translate3d(0, ${(scrollProgress - 0.5) * -20}px, 0)`,
              willChange: 'transform'
            }}
          >
            <div className="p-8 bg-brand-navy border border-white/10 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Project Status</h3>
                <span className="text-xs text-white/40">Updated just now</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60">Overall Progress</span>
                  <span className="text-brand-orange font-medium">75%</span>
                </div>
                <div className="h-3 bg-brand-navy-dark rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-red-light rounded-full"
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
                    <span className={`w-3 h-3 rounded-full ${status.dotColor}`} />
                    <span className={`font-medium ${status.color}`}>{status.label}</span>
                    {index < 2 && (
                      <span className="ml-auto text-xs text-white/40">Completed</span>
                    )}
                    {index === 2 && (
                      <span className="ml-auto text-xs text-brand-orange-light">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-red-light/20 rounded-full blur-2xl" />
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

  const { ref, translateY, scrollProgress } = useParallax(0.7); // Speed 0.7

  return (
    <section
      id="why-helix"
      ref={ref}
      className="pt-24 pb-40 bg-white relative overflow-hidden rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[5] section-white-overlap"
    >
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-10 right-20 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-20 w-[300px] h-[300px] bg-brand-red-light/10 rounded-full blur-[140px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
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
          <span className="inline-block text-sm font-bold text-brand-orange mb-4 uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
            Why Brands Choose Helix
          </h2>
          <p className="text-lg text-brand-navy/60 max-w-2xl mx-auto">
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
              className="text-center p-8 bg-brand-navy/5 border border-brand-navy/10 rounded-2xl hover:border-brand-orange/30 transition-all group shadow-lg hover:shadow-brand-orange/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-red-light/20 border border-brand-orange/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">{benefit.title}</h3>
              <p className="text-brand-navy/60 leading-relaxed">{benefit.description}</p>
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

  const { ref, translateY, scrollProgress } = useParallax(0.5); // Speed 0.5

  return (
    <section id="testimonials" ref={ref} className="py-32 overflow-hidden relative bg-white">
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-brand-orange/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-red-light/10 rounded-full blur-[140px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
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
          <span className="inline-block text-sm font-bold text-brand-orange mb-4 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-brand-navy/60 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with Helix.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="p-10 bg-white border border-brand-navy/5 rounded-3xl hover:border-brand-orange/30 transition-all shadow-lg text-brand-navy"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                ))}
              </div>

              {/* Review */}
              <p className="text-brand-navy/80 mb-8 leading-relaxed text-lg">&ldquo;{testimonial.review}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-red-light flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-brand-navy font-bold text-lg">{testimonial.name}</div>
                  <div className="text-sm text-brand-navy/40">{testimonial.brand}</div>
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
    <section ref={ref} className="pt-24 pb-40 overflow-hidden relative bg-black rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[6] section-black-overlap">
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[200px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: 'transform'
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative p-12 sm:p-16 bg-gradient-to-br from-brand-orange via-brand-red-light to-brand-orange rounded-3xl overflow-hidden text-center shadow-2xl shadow-brand-orange/20"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Build Your Brand with Helix?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
              Join hundreds of growing brands who trust Helix for their creative needs.
            </p>
            <Link href="/auth" className="px-10 py-5 bg-white text-brand-navy-dark font-bold text-lg rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1 inline-flex items-center gap-3">
              Create Your Brand Account
              <ArrowRight className="w-6 h-6" />
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
  const currentYear = new Date().getFullYear();
  const { ref, translateY } = useParallax(0.2);

  return (
    <footer
      ref={ref}
      className="py-16 relative overflow-hidden bg-white rounded-t-[40px] sm:rounded-t-[60px] lg:rounded-t-[80px] -mt-10 z-[7] section-white-overlap"
      role="contentinfo"
    >
      {/* Layer 1: Background (Moves opposite) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translate3d(0, ${-translateY * 0.4}px, 0) scale(1.05)`, willChange: 'transform' }}
      >
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[150px]" />
      </div>

      {/* Layer 2: Content */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: 'transform'
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={32}
              className="object-contain mix-blend-multiply"
            />
            <span className="text-xl font-bold text-brand-navy">Helix</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8" aria-label="Footer navigation">
            <a href="#services" className="text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
              Services
            </a>
            <Link href="/dashboard" className="text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
              Dashboard
            </Link>
            <a href="mailto:hello@helix.app" className="text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-brand-navy/40">
            © {currentYear} Helix. All rights reserved.
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
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <ServicesSection />
      <HowItWorksSection />
      <ProjectTrackingSection />
      <WhyHelixSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
