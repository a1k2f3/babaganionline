// app/support/faq/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Baba Gani Online",
  description:
    "Find answers to frequently asked questions about shopping, orders, shipping, returns, and payments at Baba Gani Online – Pakistan's trusted online store.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}