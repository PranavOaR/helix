import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import SkipToContent from "@/components/SkipToContent";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0E2A85" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://helix.app"),
  title: {
    default: "Helix - Build. Launch. Scale Your Brand",
    template: "%s | Helix",
  },
  description:
    "Helix is your all-in-one platform to request creative services and track projects seamlessly. Website development, UI/UX design, branding, and more.",
  keywords: [
    "brand services",
    "creative agency",
    "website development",
    "UI/UX design",
    "branding",
    "app development",
    "design services",
    "project tracking",
  ],
  authors: [{ name: "Helix" }],
  creator: "Helix",
  publisher: "Helix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://helix.app",
    siteName: "Helix",
    title: "Helix - Build. Launch. Scale Your Brand",
    description:
      "Your all-in-one platform for creative services. From websites to branding, we've got you covered.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Helix - Creative Services Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix - Build. Launch. Scale Your Brand",
    description:
      "Your all-in-one platform for creative services. From websites to branding, we've got you covered.",
    images: ["/og-image.png"],
    creator: "@helixapp",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://helix.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Firebase for performance */}
        <link rel="preconnect" href="https://firebaseapp.com" />
        <link rel="preconnect" href="https://googleapis.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Helix",
              description: "All-in-one platform for creative services and project tracking",
              url: "https://helix.app",
              logo: "https://helix.app/logo.png",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English"],
              },
              offers: {
                "@type": "AggregateOffer",
                description: "Creative Services",
                offerCount: 5,
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-brand-navy-dark overflow-x-hidden text-white">
        <SkipToContent />
        <AuthProvider>
          <main id="main-content">{children}</main>
        </AuthProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
