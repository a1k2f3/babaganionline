"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-gray-300 py-12 border-t">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info & Tagline */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">BuyBot</h3>
          <p className="text-sm">
            Connecting Customers & Vendors Smarter.
          </p>
          <p className="text-sm">
            The intelligent platform for seamless buying, selling, and collaboration.
          </p>
        </div>

        {/* For Customers */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">For Customers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/browse" className="hover:text-blue-300 transition">Browse Products</Link></li>
           
            <li><Link href="/support/contact" className="hover:text-blue-300 transition">Customer Support</Link></li>
            <li><Link href="/support/faq" className="hover:text-blue-300 transition">FAQ</Link></li>
          </ul>
        </div>

        {/* For Vendors */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">For Vendors</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sell" className="hover:text-blue-300 transition">Start Selling</Link></li>
            
            <li><Link href="/pricing" className="hover:text-blue-300 transition">Pricing Plans</Link></li>
            <li><Link href="/support/contact" className="hover:text-blue-300 transition">Resources</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <p className="text-sm mb-2"><Link href={'/support/contact'}>Contact Us</Link></p>
            
          </div>

                  </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-8 border-t border-blue-800 text-center text-sm">
        <p>
          © {currentYear} <span className="font-semibold text-blue-300">BabaGaniOnline</span>. All rights reserved. 
          <span className="ml-4">
            <Link href="/static/privacy-policy" className="hover:text-blue-300 mx-2">Privacy Policy</Link> | 
            <Link href="/static/terms" className="hover:text-blue-300 mx-2">Terms of Service</Link>
          </span>
        </p>
      </div>
    </footer>
  );
}