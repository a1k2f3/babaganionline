// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/avbar";
import Footer from "@/components/footer/Footer";
// import BottomNavbar from "@/components/ui/BottomNavbar";

// Use Inter – 100% stable, looks almost exactly like Geist
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Enhanced Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Baba Gani Online - Shop Smarter in Pakistan",
    template: "%s | Baba Gani Online",
  },
  description:
    "Baba Gani Online: Pakistan's trusted online shopping store. Enjoy secure payments, fast nationwide delivery, easy returns, and great deals on quality products.",
  keywords:
    "online shopping Pakistan, buy online Pakistan, ecommerce Pakistan, Baba Gani Online, fast delivery Pakistan, secure shopping, cash on delivery",
  authors: [{ name: "Baba Gani Online Team" }],
  creator: "Baba Gani Online",
  publisher: "Baba Gani Online",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.babaganionline.com"), // Change to your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Baba Gani Online - Shop Smarter in Pakistan",
    description:
      "Shop quality products online with secure checkout, fast delivery across Pakistan, and easy returns.",
    url: "https://www.babaganionline.com",
    siteName: "Baba Gani Online",
    images: [
      {
        url: "/og-image.jpg", // Recommended: Add a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: "Baba Gani Online - Pakistan's Trusted Online Store",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baba Gani Online - Shop Smarter in Pakistan",
    description:
      "Secure online shopping with fast delivery and easy returns across Pakistan.",
    images: ["/og-image.jpg"],
    // creator: "@yourtwitterhandle", // Optional: add if you have Twitter
    // site: "@yourtwitterhandle",
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
  verification: {
    google: "your-google-site-verification-code", // Add from Google Search Console
    // yandex: "",
    // bing: "",
  },
};

// Viewport for mobile responsiveness
export const viewport: Viewport = {
  themeColor: "#4f46e5", // Indigo-600 – matches your brand
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect to important third-parties (optional – add if using fonts/CDN) */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}

        {/* Structured Data (JSON-LD) - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Baba Gani Online",
              url: "https://www.babaganionline.com",
              logo: "https://www.babaganionline.com/logo2.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-XXX-XXXXXXX", // Update with real number
                contactType: "Customer Service",
                areaServed: "PK",
                availableLanguage: ["English", "Urdu"],
              },
              sameAs: [
                // "https://facebook.com/babaganionline",
                // "https://instagram.com/babaganionline",
                // "https://twitter.com/babaganionline",
              ],
            }),
          }}
        />

        {/* Google Analytics (GA4) - Replace with your ID */}
        {/* <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        /> */}

        {/* Facebook Pixel (Optional) */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        /> */}
      </head>

      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main className="min-h-screen pt-6 md:pt-16 pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
        {/* <BottomNavbar /> */}
      </body>
    </html>
  );
}