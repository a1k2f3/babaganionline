// app/static/privacy-policy/page.tsx

import Link from "next/link";
import type { Metadata, Viewport } from "next";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // themeColor: "#6366f1", // optional: match your brand
};
// Remove "use client" entirely (no interactivity needed)

export const metadata: Metadata = {
  title: "Privacy Policy | BabaGaniOnline",
  description: "Read our privacy policy to understand how BabaGaniOnline collects, uses, and protects your personal information.",
};

// Optional: Make it fully static (best for policy pages)
export const revalidate = false; // or remove this line entirely

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 07, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-xl text-gray-600 mb-12">
          We respect your privacy and are committed to protecting your personal data.
        </p>
        <p className="text-sm text-gray-500">
          Last updated: <span className="font-semibold">{lastUpdated}</span>
        </p>

        {/* Add your full privacy policy content here */}
        <div className="mt-16 text-left bg-white rounded-3xl shadow-lg p-10 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-gray-700">
              We collect information you provide directly, such as when you create an account, place an order, or contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700">
              To process orders, improve our services, communicate with you, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Your Rights</h2>
            <p className="text-gray-700">
              You have the right to access, correct, or delete your personal data at any time.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Questions? contact us at{" "}
            <Link href="mailto:support@babaganionline.com" className="text-indigo-600 hover:underline">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}