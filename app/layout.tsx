import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/avbar"; // Likely "@/components/Navbar"
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BabaGaniOnline - Premium Physical Products Online Store",
    template: "%s | BabaGaniOnline", // Great for product pages: e.g., "Product Name | BabaGaniOnline"
  },
  description:
    "Shop premium physical products at BabaGaniOnline by Akif Imran. Discover high-quality items with fast shipping, secure payments, and excellent customer service. Your trusted online store for [your product categories, e.g., fashion, electronics, home goods].",
  keywords: [
    "online shopping",
    "buy physical products online",
    "premium products",
    "ecommerce store",
    "fast shipping",
    "secure payment",
    "Akif Imran",
    "BabaGaniOnline",
    "shop online", // Add specific categories here, e.g., "men's clothing", "gadgets", "home decor"
    "best deals online",
    "quality products",
    "reliable online store",
  ],
  authors: [{ name: "Akif Imran", url: "https://babaganionline.com" }],
  creator: "Akif Imran",
  publisher: "BabaGaniOnline",
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
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: "https://babaganionline.com",
  },
  verification: {
    google: "your-google-site-verification-code", // Add your Google Search Console code here
  },
  openGraph: {
    title: "BabaGaniOnline - Shop Premium Physical Products Online",
    description:
      "Explore and buy high-quality physical products from BabaGaniOnline. Enjoy secure shopping, quick delivery, and top-notch customer support by Akif Imran.",
    url: "https://babaganionline.com",
    siteName: "BabaGaniOnline",
    images: [
      {
        url: "https://babaganionline.com/og-image.jpg", // 1200x630 recommended – feature your store logo/products
        width: 1200,
        height: 630,
        alt: "BabaGaniOnline - Premium Physical Products Store by Akif Imran",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BabaGaniOnline - Premium Physical Products Online",
    description:
      "Shop the best physical products online with fast shipping and secure checkout at BabaGaniOnline.",
    images: ["https://babaganionline.com/twitter-image.jpg"], // Reuse OG image
    creator: "@yourtwitterhandle", // Update with your handle
    site: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}