// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/avbar";
import Footer from "@/components/footer/Footer";
import Whatsaapbutton from "@/components/card/Whatsaapbutton"
// import BottomNavbar from "@/components/ui/BottomNavbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Baba Gani Online | Online Shopping in Pakistan",
    template: "%s | Baba Gani Online",
  },
  description: "Browse products and categories at Baba Gani Online.",
  authors: [{ name: "Baba Gani Online Team" }],
  creator: "Baba Gani Online",
  publisher: "Baba Gani Online",
  metadataBase: new URL("https://www.babaganionline.com"),
  openGraph: {
    title: "Baba Gani Online | Online Shopping in Pakistan",
    description: "Browse products and categories at Baba Gani Online.",
    siteName: "Baba Gani Online",
    images: ["/logo2.jpg"],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Baba Gani Online | Online Shopping in Pakistan",
    description: "Browse products and categories at Baba Gani Online.",
    images: ["/logo2.jpg"],
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

export const viewport: Viewport = {
  themeColor: "#0f172a",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.babaganionline.com/#organization",
                  name: "Baba Gani Online",
                  url: "https://www.babaganionline.com",
                  logo: "https://www.babaganionline.com/logo2.jpg",
                  areaServed: { "@type": "Country", name: "Pakistan" },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.babaganionline.com/#website",
                  name: "Baba Gani Online",
                  url: "https://www.babaganionline.com",
                  publisher: { "@id": "https://www.babaganionline.com/#organization" },
                  inLanguage: "en-PK",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://www.babaganionline.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        {/* Meta Pixel */}
        <script
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
        fbq('init', '1385138273451295');
        fbq('track', 'PageView');
      `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1385138273451295&ev=PageView&noscript=1" alt="Facebook Pixel" />`,
          }}
        />
      </head>

      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <div className="min-h-screen pb-20 lg:pb-0">
          <GoogleOAuthProvider
  clientId={"951319721836-ugom4e2tv9n462jjndnl4abjjpvi96f1.apps.googleusercontent.com"}
>
  {children}
</GoogleOAuthProvider>
          <Whatsaapbutton/>
        </div>

        <Footer />
        {/* <BottomNavbar /> */}
      </body>
    </html>
  );
}