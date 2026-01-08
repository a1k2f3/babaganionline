// app/pricing/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Rocket, Store, Zap, Shield, Mail, Sparkles, Crown } from "lucide-react";
export const metadata = {
  title: "Vendor Pricing | Baba Gani Online",
  description: "Discover competitive pricing plans for vendors on Baba Gani Online. Start selling your products to millions of customers across Pakistan with low commissions.",
};
export default function VendorPricingComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/" className="inline-block">
            <Image
              src="/logo2.jpg"
              alt="BabaGaniOnline"
              width={140}
              height={140}
              className="rounded-2xl shadow-2xl mx-auto"
            />
          </Link>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
          Vendor Pricing
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
            Coming Soon
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
          We're crafting powerful, flexible pricing plans designed exclusively for vendors like you — 
          with lower commissions, unlimited listings, and tools to help you grow faster.
        </p>

        {/* Teaser Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
            <Crown className="w-14 h-14 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Plans</h3>
            <p className="text-gray-600">From free to professional tiers with reduced fees</p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
            <Zap className="w-14 h-14 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Faster Growth</h3>
            <p className="text-gray-600">Priority visibility, marketing tools & analytics</p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50">
            <Store className="w-14 h-14 text-pink-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Selling</h3>
            <p className="text-gray-600">Simple onboarding, secure payouts & full support</p>
          </div>
        </div>

        {/* Rocket Animation */}
        <div className="my-16">
          <Rocket className="w-32 h-32 text-indigo-600 mx-auto animate-bounce" />
          <Sparkles className="w-10 h-10 text-yellow-400 absolute top-1/3 left-1/4 animate-ping" />
          <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 right-1/3 animate-ping delay-300" />
        </div>

        {/* Notify Me Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border border-white/50">
          <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Be the First to Know
          </h3>
          <p className="text-lg text-gray-600 mb-10">
            Get notified the moment vendor pricing launches — plus early access benefits!
          </p>

          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your business email"
              className="flex-1 px-8 py-5 rounded-2xl border-2 border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900 text-lg"
              required
            />
            <button
              type="submit"
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition shadow-xl text-lg"
            >
              Notify Me
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            <Shield className="w-4 h-4 inline mr-1" />
            We promise — no spam. Just one email when it's ready.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-20">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-indigo-700 hover:text-indigo-900 font-semibold text-lg transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}