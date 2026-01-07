// app/layout.tsx
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "BabaGaniOnline - Shop Smarter us",
  description: "The best ecommerce website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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