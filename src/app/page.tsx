import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Features />
            <About />
            <Testimonials />
            <CTA />
            <Footer />
        </main>
    );
}
