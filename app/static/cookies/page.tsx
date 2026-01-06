// app/cookies/page.tsx
import Link from "next/link";
import { Cookie, Shield, Settings, Globe, Clock, CheckCircle } from "lucide-react";

export default function CookiePolicyPage() {
  const lastUpdated = "January 07, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Cookie className="w-6 h-6" />
            Cookie Policy
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Our Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We use cookies to improve your experience, analyze traffic, and personalize content on BabaGaniOnline.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: <span className="font-medium">{lastUpdated}</span>
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-3xl shadow-lg p-10 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-10 h-10 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. 
                They help websites remember your preferences, understand how you use the site, and provide a better experience.
              </p>
            </div>
          </div>

          <p className="text-gray-600 italic">
            We respect your privacy and only use cookies to enhance your shopping experience on BabaGaniOnline.
          </p>
        </section>

        {/* Types of Cookies */}
        <section className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Types of Cookies We Use
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Essential Cookies */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Settings className="w-12 h-12 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Essential Cookies</h3>
              </div>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Remember your login session</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Keep items in your shopping cart</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Secure checkout process</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                <strong>Cannot be disabled</strong> — required for core functionality.
              </p>
            </div>

            {/* Analytics & Performance */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-12 h-12 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Analytics Cookies</h3>
              </div>
              <p className="text-gray-700 mb-4">
                These help us understand how visitors use our site so we can improve it.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Track page views and navigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Measure site performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Identify popular products</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-6">
                Anonymous data only — no personal identification.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Clock className="w-12 h-12 text-pink-600" />
                <h3 className="text-xl font-bold text-gray-900">Functional Cookies</h3>
              </div>
              <p className="text-gray-700 mb-4">
                These remember your preferences to make your experience better.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Save your language preference</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Remember recently viewed items</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Personalized recommendations</span>
                </li>
              </ul>
            </div>

            {/* Third-Party */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-12 h-12 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Third-Party Cookies</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Used by trusted partners for advertising and social features.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Facebook Pixel (retargeting)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Google Analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Payment gateway partners</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Manage Cookies */}
        <section className="bg-indigo-50 rounded-3xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Manage Your Cookie Preferences
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-10">
            You can control cookies through your browser settings or our cookie consent banner (shown on first visit).
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-3">Browser Settings</h4>
              <p className="text-gray-600">
                Most browsers allow you to refuse cookies or delete them. Learn how:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener" className="text-indigo-600 hover:underline">Safari</a></li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-3">Our Consent Tool</h4>
              <p className="text-gray-600 mb-4">
                Click below to adjust your preferences anytime.
              </p>
              <button
                onClick={() => {
                  // In real app, trigger your cookie consent banner
                  alert("Cookie preferences will open here (integrate your consent tool)");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </section>

        {/* Contact & Updates */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            If you have any concerns about our use of cookies, please contact us.
          </p>
          <Link
            href="/support/contact"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition shadow-lg"
          >
            Contact Support
          </Link>

          <p className="text-sm text-gray-500 mt-12">
            We may update this policy from time to time. Continued use of BabaGaniOnline means you accept the latest version.
          </p>
        </section>
      </div>
    </div>
  );
}