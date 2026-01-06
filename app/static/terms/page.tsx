'use client';

export const dynamic = "force-dynamic";
export const revalidate = 60;

import React from 'react';
import { FileText, Shield, Truck, CreditCard, Ban, Gavel, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = "January 04, 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to <span className="font-semibold text-indigo-600">Baba Gani Online</span> — Your Trusted Marketplace
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of <strong>Baba Gani Online</strong> (the "Platform"), including our website, mobile app, and any services provided. 
            By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use our services.
          </p>
          <p className="mt-4 text-gray-700">
            Baba Gani Online is an e-commerce marketplace that connects buyers and independent sellers. We facilitate transactions but are not a party to the sale unless explicitly stated.
          </p>
        </section>

        {/* Eligibility */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Eligibility
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>You must be at least 18 years old to use the Platform</li>
            <li>You must provide accurate and complete information during registration</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You may not use the Platform for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        {/* User Accounts */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            Buyer Responsibilities
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>Provide accurate shipping and payment information</li>
            <li>Pay for all purchased items in full</li>
            <li>Review product descriptions, seller ratings, and policies before purchasing</li>
            <li>Contact the seller first for order issues; escalate to us if unresolved</li>
            <li>Comply with return and refund policies of individual sellers</li>
          </ul>
        </section>

        {/* Seller Responsibilities */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-600" />
            Seller Responsibilities
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>List accurate product descriptions, prices, and images</li>
            <li>Ship orders promptly and provide tracking information</li>
            <li>Honor your stated return and refund policies</li>
            <li>Handle customer inquiries and disputes professionally</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Pay any applicable platform fees</li>
          </ul>
        </section>

        {/* Prohibited Activities */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Ban className="w-8 h-8 text-red-600" />
            Prohibited Activities
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>Sell counterfeit, illegal, or prohibited items</li>
            <li>Post false, misleading, or fraudulent listings</li>
            <li>Infringe on intellectual property rights</li>
            <li>Engage in spam, phishing, or harassment</li>
            <li>Interfere with the Platform's functionality</li>
            <li>Use automated tools to scrape or access data</li>
          </ul>
        </section>

        {/* Payments & Fees */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            Payments, Refunds & Fees
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed list-disc list-inside ml-4">
            <li>All payments are processed through secure third-party gateways</li>
            <li>Refunds are governed by individual seller policies</li>
            <li>Baba Gani Online may charge transaction or service fees</li>
            <li>We reserve the right to adjust fees with notice</li>
          </ul>
        </section>

        {/* Intellectual Property & Liability */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Gavel className="w-8 h-8 text-indigo-600" />
            Intellectual Property & Limitation of Liability
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-lg mb-2">Intellectual Property</h3>
              <p>All content on the Platform (logos, design, text) is owned by Baba Gani Online or licensed to us.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Limitation of Liability</h3>
              <p>The Platform is provided "as is". We are not liable for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Product quality, safety, or legality sold by third-party sellers</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or profits arising from use of the Platform</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Termination & Changes */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Ban className="w-8 h-8 text-indigo-600" />
            Termination & Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account for violations of these Terms. 
            We may update these Terms at any time — continued use of the Platform constitutes acceptance of changes.
          </p>
        </section>

        {/* Governing Law & Contact */}
        {/* <section className="bg-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Mail className="w-8 h-8 text-indigo-600" />
            Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            For questions about these Terms, please contact us at:
          </p>
          <div className="mt-6 space-y-2">
            <p className="font-medium">Email: <a href="mailto:legal@babaganionline.com" className="text-indigo-600 hover:underline">legal@babaganionline.com</a></p>
            <p>Support: <a href="mailto:support@babaganionline.com" className="text-indigo-600 hover:underline">support@babaganionline.com</a></p>
            <p>Address: <span className="font-medium">123 Marketplace Street, Commerce City, CC 12345</span></p>
          </div>
        </section> */}

        <p className="text-center text-sm text-gray-500 mt-12">
          Thank you for being part of the <strong>Baba Gani Online</strong> community.
        </p>
      </div>
    </div>
  );
}