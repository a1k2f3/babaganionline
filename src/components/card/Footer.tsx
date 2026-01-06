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

          {/* Social Icons */}
          {/* <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743A11.65 11.65 0 013.734 5.116a4.107 4.107 0 001.27 5.477 4.037 4.037 0 01-1.862-.513v.052a4.108 4.108 0 003.29 4.025 4.086 4.086 0 01-1.853.07 4.108 4.108 0 003.834 2.85 8.233 8.233 0 01-5.098 1.756 8.337 8.337 0 01-.978-.057 11.616 11.616 0 006.29 1.841"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.427 1.619 4.427 4.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.252-1.619 4.427-4.427 4.427-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.427-1.619-4.427-4.427-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.252 1.619-4.427 4.427-4.427 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.28-.072 1.689-.072 4.947s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98.28.058 1.689.072 4.947.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-.28-.058-1.689-.072-4.947-.072z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.164 0-2.107-.943-2.107-2.107 0-1.164.943-2.107 2.107-2.107 1.164 0 2.107.943 2.107 2.107 0 1.164-.943 2.107-2.107 2.107zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454c.979 0 1.773-.774 1.773-1.729V1.729C24 .774 23.206 0 22.225 0z"/></svg>
            </a>
          </div> */}
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