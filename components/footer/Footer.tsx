// components/Footer.tsx
"use client";

import Link from "next/link";
import React from "react";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const customerLinks = [
    { href: "/", label: "Browse Products" },
    { href: "/categories", label: "All Categories" },
    { href: "/support/faq", label: "FAQ" },
    { href: "/support/contact", label: "Customer Support" },
  ];

  const vendorLinks = [
    { href: "/sell", label: "Start Selling" },
    { href: "/static/pricing", label: "Pricing Plans" },
    { href: "/support/contact", label: "Vendor Resources" },
  ];

//   const companyLinks = [
//     { href: "/about", label: "About Us" },
//     { href: "/careers", label: "Careers" },
//     { href: "/blog", label: "Blog" },
//     { href: "/press", label: "Press" },
//   ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand & Description */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
            <h3 className="text-2xl font-bold text-white">BabaGaniOnline</h3>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Your trusted online marketplace connecting customers with premium products and reliable vendors across Pakistan.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FiYoutube size={20} />
            </a>
          </div>
        </div>

        {/* For Customers */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">For Customers</h4>
          <ul className="space-y-3">
            {customerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-indigo-400 transition-all duration-300 group-hover:w-8" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Vendors */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">For Vendors</h4>
          <ul className="space-y-3">
            {vendorLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-indigo-400 transition-all duration-300 group-hover:w-8" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company & Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">Get in Touch</h4>
          <ul className="space-y-4 text-sm">
            {/* <li className="flex items-center gap-3 text-gray-400">
              <FiMail size={18} />
              <a href="mailto:support@babaganionline.com" className="hover:text-white transition">
                support@babaganionline.com
              </a>
            </li> */}
            <li className="flex items-center gap-3 text-gray-400">
              <FiPhone size={18} />
              <Link href="/contact" className="hover:text-white transition">
              Contact
              </Link>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <FiMapPin size={18} className="mt-0.5" />
              <span>Lahore, Punjab, Pakistan</span>
            </li>
          </ul>

          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-indigo-400">BabaGaniOnline</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/static/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/static/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/static/cookies" className="hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}