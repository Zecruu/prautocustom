import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO-optimized metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prautocustoms.com'),
  title: {
    default: "PR Auto Custom - Premium Custom Rims & Wheels in Puerto Rico",
    template: "%s | PR Auto Custom"
  },
  description: "Transform your vehicle with premium custom rims and wheels in Puerto Rico. Interactive rim visualizer, expert installation, and personalized quotes. Located in Carolina, PR. Serving all of Puerto Rico.",
  keywords: [
    "custom rims Puerto Rico",
    "custom wheels PR",
    "aros custom Puerto Rico",
    "rines personalizados",
    "car customization Carolina PR",
    "premium wheels",
    "rim installation",
    "auto customization",
    "vehicle upgrades",
    "PR Auto Custom",
    "Carolina Puerto Rico",
    "custom car rims",
    "luxury wheels"
  ],
  authors: [{ name: "PR Auto Custom" }],
  creator: "PR Auto Custom",
  publisher: "PR Auto Custom",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/logos/logo.png", sizes: "any", type: "image/png" },
      { url: "/logos/logo-150x150.png", sizes: "150x150", type: "image/png" },
    ],
    shortcut: [
      { url: "/logos/logo.png" }
    ],
    apple: [
      { url: "/logos/logo.png", sizes: "180x180", type: "image/png" }
    ],
  },
  other: [
    {
      rel: 'icon',
      url: '/logos/logo.png',
    },
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: "/",
    siteName: "PR Auto Custom",
    title: "PR Auto Custom - Premium Custom Rims & Wheels in Puerto Rico",
    description: "Transform your vehicle with premium custom rims and wheels. Interactive visualizer, expert installation, and personalized quotes in Carolina, PR.",
    images: [
      {
        url: "/images/pr-auto-custom-hero-desktop.png",
        width: 1200,
        height: 630,
        alt: "PR Auto Custom - Premium Rims & Wheels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PR Auto Custom - Premium Custom Rims & Wheels",
    description: "Transform your vehicle with premium custom rims and wheels in Puerto Rico. Interactive visualizer and expert installation.",
    images: ["/images/pr-auto-custom-hero-desktop.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here after setting up
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for Local Business (JSON-LD)
  const businessData = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": "https://www.prautocustoms.com/#business",
    "name": "PR Auto Custom",
    "alternateName": "PR Auto Custom Rims & Wheels",
    "description": "Premium custom rims and wheels installation in Puerto Rico. Expert customization services with interactive rim visualizer.",
    "url": "https://www.prautocustoms.com",
    "telephone": "+1-787-420-5538",
    "email": "info@prautocustom.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carr 190 RR2 Box 327",
      "addressLocality": "Carolina",
      "addressRegion": "PR",
      "postalCode": "00983",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.3880",
      "longitude": "-65.9574"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "$$",
    "image": "https://www.prautocustoms.com/logos/logo.png",
    "logo": "https://www.prautocustoms.com/logos/logo.png",
    "sameAs": [
      "https://www.facebook.com/prautocustom",
      "https://www.instagram.com/prautocustom"
    ],
    "areaServed": {
      "@type": "State",
      "name": "Puerto Rico"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Custom Rims & Wheels Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Rim Installation",
            "description": "Professional installation of premium custom rims and wheels"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wheel Customization",
            "description": "Personalized wheel customization and design services"
          }
        }
      ]
    }
  };

  // Organization Schema for Google Knowledge Graph (this shows the logo in search)
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.prautocustoms.com/#organization",
    "name": "PR Auto Custom",
    "legalName": "PR Auto Custom",
    "url": "https://www.prautocustoms.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.prautocustoms.com/logos/logo.png",
      "width": "512",
      "height": "512"
    },
    "image": "https://www.prautocustoms.com/logos/logo.png",
    "description": "Premium custom rims and wheels in Puerto Rico. Expert installation and personalized service.",
    "telephone": "+1-787-420-5538",
    "email": "info@prautocustom.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carr 190 RR2 Box 327",
      "addressLocality": "Carolina",
      "addressRegion": "PR",
      "postalCode": "00983",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/prautocustom",
      "https://www.instagram.com/prautocustom"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data - Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
        />
        {/* Structured Data - Organization (for logo in Google search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        {/* Favicon - PR Auto Customs Logo */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logos/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logos/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logos/logo.png" />
        <link rel="shortcut icon" href="/logos/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />

        <SessionProvider>
          <I18nProvider>
            <CartProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <Toaster
                position="bottom-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </CartProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
