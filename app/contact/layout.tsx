// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Baba Gani Online",
  description:
    "Get in touch with Baba Gani Online support team. We're here to help with orders, deliveries, returns, or any questions. Fast response across Pakistan.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}