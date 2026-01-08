// app/support/feedback/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews & Feedback | Baba Gani Online",
  description:
    "Read honest customer reviews and share your feedback on Baba Gani Online. Help others shop confidently with real experiences from Pakistan buyers.",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}