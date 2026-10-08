import type { Metadata, Viewport } from "next";
import { STUDIO_CONFIG } from "@/content/studio";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://redstudios.com"),
  title: {
    default: "Red Studios — Creative Production & Direction",
    template: "%s | Red Studios",
  },
  description:
    "Award-winning creative production studio specializing in high-end product photography, commercial ad editing, and bespoke full-stack website development.",
  keywords: [
    "creative production studio",
    "product photography",
    "commercial video editing",
    "Next.js web development",
    "landing page design",
    "luxury art direction",
    "cinematography",
  ],
  authors: [{ name: "Red Studios Creative Direction" }],
  creator: "Red Studios",
  publisher: "Red Studios",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://redstudios.com",
    title: "Red Studios — Creative Production & Digital Experiences",
    description:
      "High-end product photography, commercial ad editing, and full-stack website development for visionary brands.",
    siteName: "Red Studios",
    images: [
      {
        url: "/base_dark_16_9.png",
        width: 2048,
        height: 1152,
        alt: "Red Studios Creative Direction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Studios — Creative Production & Direction",
    description:
      "Award-winning product cinematography, commercial post-production, and full-stack digital platforms.",
    images: ["/base_dark_16_9.png"],
    creator: "@redstudios",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: STUDIO_CONFIG.studioName,
    url: "https://redstudios.com",
    logo: "https://redstudios.com/base_dark_16_9.png",
    description: STUDIO_CONFIG.tagline,
    email: STUDIO_CONFIG.email,
    telephone: STUDIO_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressCountry: "US",
    },
    sameAs: [
      "https://instagram.com/redstudios",
      "https://twitter.com/redstudios",
      "https://behance.net/redstudios",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "High-End Product Photography & Videography",
      },
      {
        "@type": "Offer",
        name: "Advertisement Editing & Post-Production",
      },
      {
        "@type": "Offer",
        name: "Full-Stack Website Development",
      },
      {
        "@type": "Offer",
        name: "Landing Page Design & Development",
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts preconnect & stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-[#F5F2EE] font-sans selection:bg-[#E10600] selection:text-white">
        {children}
      </body>
    </html>
  );
}
