# Helix Landing Page - Implementation Plan

A modern, animated landing page built with React, TypeScript, and Framer Motion, inspired by the Kyte Agency design aesthetic.

---

## User Review Required

> [!IMPORTANT]
> Please review the proposed sections and design direction below. Let me know if you'd like to:
> - Add/remove any sections
> - Change the color scheme or typography
> - Modify the animation style (subtle vs. bold)
> - Adjust the overall aesthetic direction

---

## Project Overview

### Tech Stack
- **Framework**: Vite + React 18 + TypeScript
- **Animation**: Framer Motion
- **Styling**: Vanilla CSS with CSS Variables
- **Fonts**: Inter (primary), DM Sans (accent)

### Design Direction
Based on the Kyte template you provided, I'll create a **dark-themed, modern landing page** with:
- Dark background (#0f0f0f / #171717)
- Accent color: Purple gradient (#8260e6 → #4d28bd)
- White/light text for contrast
- Glassmorphism effects
- Smooth scroll-triggered animations

---

## Proposed Sections

### 1. Navbar
- Fixed/sticky navigation
- Logo on left, nav links center, CTA button right
- Smooth scroll to sections
- **Animation**: Fade in on load, background blur on scroll

### 2. Hero Section
- Large headline with animated text reveal
- Subtitle with staggered fade-in
- Primary CTA button with hover effects
- Optional: Animated background gradient or particles
- **Animations**: 
  - Text reveal (word-by-word or letter-by-letter)
  - Button slide-up with spring
  - Background subtle pulse

### 3. Features/Services Section
- 3-4 feature cards in a grid
- Icons or illustrations
- Short descriptions
- **Animations**: 
  - Cards fade-in and slide-up on scroll
  - Staggered entrance (0.1s delay between cards)
  - Hover scale effect

### 4. About/Stats Section
- Company description
- Key statistics (animated counters)
- Optional image/illustration
- **Animations**:
  - Number count-up animation
  - Image parallax on scroll

### 5. Testimonials Section
- Carousel or grid of testimonials
- Client photos, quotes, names
- **Animations**:
  - Fade transitions between testimonials
  - Quote mark scale animation

### 6. CTA Section
- Bold call-to-action
- Gradient background
- Email input or button
- **Animations**:
  - Section zoom-in on scroll
  - Button pulse effect

### 7. Footer
- Logo
- Quick links
- Social media icons
- Copyright
- **Animation**: Fade-in on scroll into view

---

## Proposed File Structure

```
Helix/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Global styles & CSS variables
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useScrollAnimation.ts   # Custom hook for scroll animations
│   └── assets/
│       └── (images, icons)
└── public/
    └── favicon.ico
```

---

## Proposed Changes

### Setup & Configuration

#### [NEW] package.json
- Initialize Vite React TypeScript project
- Add framer-motion dependency

#### [NEW] vite.config.ts
- Standard Vite configuration for React

#### [NEW] tsconfig.json
- TypeScript configuration with strict mode

---

### Core Files

#### [NEW] src/index.css
Design system with:
- CSS variables for colors, spacing, typography
- Dark theme base styles
- Utility classes for animations
- Responsive breakpoints

#### [NEW] src/App.tsx
Main layout composing all sections

#### [NEW] src/main.tsx
React entry point

---

### Components

#### [NEW] src/components/Navbar.tsx
- Fixed position, glassmorphism background
- Framer Motion `motion.nav` with initial/animate states
- Scroll-aware background opacity

#### [NEW] src/components/Hero.tsx
- Full viewport height
- Animated headline using `motion.h1` with variants
- Staggered children animations
- CTA button with whileHover/whileTap

#### [NEW] src/components/Features.tsx
- CSS Grid layout for cards
- `useInView` hook for scroll detection
- Staggered card animations with variants

#### [NEW] src/components/About.tsx
- Split layout (text + visual)
- Animated counters using `useSpring`
- Parallax effect on image

#### [NEW] src/components/Testimonials.tsx
- Card-based layout or carousel
- `AnimatePresence` for smooth transitions

#### [NEW] src/components/CTA.tsx
- Gradient background section
- Scale animation on scroll into view

#### [NEW] src/components/Footer.tsx
- Multi-column layout
- Social icons with hover animations

---

### Hooks

#### [NEW] src/hooks/useScrollAnimation.ts
Reusable hook wrapping `useInView` and `useAnimation` for consistent scroll-triggered animations

---

## Animation Patterns

| Effect | Framer Motion API | Use Case |
|--------|------------------|----------|
| Fade In | `opacity: 0 → 1` | Most elements |
| Slide Up | `y: 50 → 0` | Cards, text |
| Scale | `scale: 0.9 → 1` | CTA sections |
| Stagger | `staggerChildren` | Lists, grids |
| Scroll Trigger | `useInView` | All sections |
| Parallax | `useScroll` + `useTransform` | Backgrounds |
| Spring | `type: "spring"` | Buttons, interactions |

---

## Verification Plan

### Automated Tests
> No automated tests for this UI-focused project. Visual verification is primary.

### Manual Verification

#### 1. Development Server Test
```bash
cd "c:\Users\Shashank U\Documents\GitHub\Helix"
npm run dev
```
- Open http://localhost:5173 in browser
- Verify page loads without errors

#### 2. Animation Verification
- [ ] Hero text animates on page load
- [ ] Navbar appears with fade effect
- [ ] Scroll down - features animate into view
- [ ] All hover effects work on buttons/cards
- [ ] Smooth scroll between sections

#### 3. Responsive Testing
- [ ] Desktop (1440px+): Full layout
- [ ] Tablet (768px-1024px): Adjusted grid
- [ ] Mobile (< 768px): Single column, hamburger menu

#### 4. Performance Check
- Open DevTools > Performance
- Verify animations run at 60fps
- No layout thrashing during scroll

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|---------------|
| Project setup | 10 min |
| Design system | 15 min |
| Navbar + Hero | 20 min |
| Features section | 15 min |
| About section | 15 min |
| Testimonials | 15 min |
| CTA + Footer | 15 min |
| Polish & responsive | 20 min |
| **Total** | ~2 hours |

---

## Questions for You

1. **Brand Name**: Should I use "Helix" as the brand name throughout?
2. **Color Preference**: Keep the purple accent, or do you have a different brand color?
3. **Content**: Should I use placeholder text, or do you have specific copy?
4. **Images**: Should I generate placeholder images, or will you provide assets?
5. **Sections**: Are all 7 sections needed, or would you like to add/remove any?
