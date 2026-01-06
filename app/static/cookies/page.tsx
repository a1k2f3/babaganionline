// app/cookies/page.tsx
import Link from "next/link";
import { Cookie, Shield, Settings, Globe, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function CookiePolicyPage() {
  const lastUpdated = "January 07, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Cookie className="w-6 h-6" />
            Cookie Policy
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            We Use Cookies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cookies help us deliver a better shopping experience, keep your cart safe, and show you products you’ll love.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* What Are Cookies */}
        <section className="bg-white rounded-3xl shadow-lg p-10 mb-12">
          <div className="flex items-start gap-6">
            <Cookie className="w-12 h-12 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What Are Cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Cookies are tiny text files stored on your device when you visit a website. They help the site remember you, 
                save your preferences, and make things faster and smoother.
              </p>
              <p className="text-gray-700">
                At BabaGaniOnline, we use cookies responsibly to improve your experience — never to track you across the web or sell your data.
              </p>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="space-y-10 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Types of Cookies We Use
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Essential */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-md border border-indigo-100">
              <div className="flex items-center gap-4 mb-6">
                <Settings className="w-12 h-12 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Essential Cookies</h3>
              </div>
              <p className="text-gray-700 mb-5">
                Required for the website to work properly.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Keep you logged in
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Remember items in your cart
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Secure checkout process
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                <strong>Cannot be turned off</strong> — needed for core features.
              </p>
            </div>

            {/* Performance & Analytics */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-md border border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-12 h-12 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Performance Cookies</h3>
              </div>
              <p className="text-gray-700 mb-5">
                Help us improve site speed and performance.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Measure page load times
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Track popular products
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Fix bugs faster
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                Anonymous data only — we never identify you personally.
              </p>
            </div>

            {/* Functional */}
            <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 shadow-md border border-pink-100">
              <div className="flex items-center gap-4 mb-6">
                <Eye className="w-12 h-12 text-pink-600" />
                <h3 className="text-xl font-bold text-gray-900">Functional Cookies</h3>
              </div>
              <p className="text-gray-700 mb-5">
                Remember your preferences for a better experience.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Save your language or currency
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Show recently viewed items
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Personalize recommendations
                </li>
              </ul>
            </div>

            {/* Marketing (Optional) */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 shadow-md border border-green-100">
              <div className="flex items-center gap-4 mb-6">
                <EyeOff className="w-12 h-12 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Marketing Cookies</h3>
              </div>
              <p className="text-gray-700 mb-5">
                Show you relevant offers (with your consent).
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Retargeting on social media
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Personalized promotions
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                You can disable these anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Manage Cookies */}
        <section className="bg-indigo-50 rounded-3xl p-12 mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            You Control Your Cookies
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
            You can manage or delete cookies through your browser settings at any time. 
            Note: disabling essential cookies may affect site functionality.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            
              <Settings className="w-6 h-6" />
              Manage Cookie Preferences
            

            <Link
              href="/support/contact"
              className="inline-flex items-center gap-3 border-4 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-5 px-10 rounded-2xl transition"
            >
              Contact Us for Help
            </Link>
          </div>
        </section>

        {/* Closing */}
        <section className="text-center">
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Trust Is Our Priority
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We only use cookies to make your experience better — never to invade your privacy.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-12">
            Questions? Reach out anytime at <Link href="mailto:support@babaganionline.com" className="text-indigo-600 hover:underline">support@babaganionline.com</Link>
          </p>
        </section>
      </div>
    </div>
  );
}