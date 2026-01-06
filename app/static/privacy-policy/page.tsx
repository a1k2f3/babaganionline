'use client';

export const dynamic = "force-dynamic";
export const revalidate = 60;

import React from 'react';
import { Shield, Lock, CreditCard, Truck, Mail, Cookie } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 04, 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy is important to us at <span className="font-semibold text-indigo-600">Baba Gani Online</span>
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to <strong>Baba Gani Online</strong>, your trusted e-commerce marketplace connecting buyers and sellers across the region. 
            We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile app, or make purchases.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Lock className="w-8 h-8 text-indigo-600" />
            Information We Collect
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name, email address, phone number, and shipping address</li>
                <li>Payment information (processed securely via third-party gateways)</li>
                <li>Account credentials (encrypted passwords)</li>
                <li>Order history and wishlist items</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Non-Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Browser type, device information, and IP address</li>
                <li>Pages visited, time spent on site, and referral sources</li>
                <li>Cookies and usage data for improving user experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            How We Use Your Information
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about orders, products, and promotions</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To improve our website, products, and services</li>
            <li>To detect and prevent fraud or unauthorized activities</li>
            <li>To personalize your shopping experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        {/* Sharing Your Information */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-600" />
            Sharing Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We share your information only when necessary:
          </p>
          <ul className="mt-4 space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>With sellers to fulfill and ship your orders</li>
            <li>With trusted third-party service providers (payment processors, shipping companies, analytics tools)</li>
            <li>When required by law or to protect our rights</li>
            <li>In the event of a business transfer (merger, acquisition)</li>
          </ul>
          <p className="mt-4 text-gray-700">
            We <strong>never sell</strong> your personal information to third parties for marketing purposes.
          </p>
        </section>

        {/* Cookies & Tracking */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Cookie className="w-8 h-8 text-indigo-600" />
            Cookies & Tracking Technologies
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze traffic, and deliver personalized ads. 
            You can control cookies through your browser settings.
          </p>
        </section>

        {/* Data Security & Rights */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Data Security & Your Rights
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-lg mb-2">Security</h3>
              <p>We use industry-standard encryption (SSL) and security measures to protect your data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
              <p className="mt-3">
                Contact us at <a href="mailto:privacy@babaganionline.com" className="text-indigo-600 font-medium hover:underline">privacy@babaganionline.com</a> to exercise your rights.
              </p>
            </div>
          </div>
        </section>

       
        <p className="text-center text-sm text-gray-500 mt-12">
          Thank you for trusting <strong>Baba Gani Online</strong> with your shopping journey.
        </p>
      </div>
    </div>
  );
}