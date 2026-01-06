"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";


const supportOptions = [
  {
    title: "Chatbot Support",
    description: "Instant help from our friendly AI assistant — available 24/7 for quick answers.",
    link: "/support/aichat",
    imgId: 3, // Friendly AI Chatbot
  },
  {
    title: "Contact Us",
    description: "Reach our dedicated support team directly via email or form for personalized assistance.",
    link: "/contact",
    imgId: 5, // Email support icon
  },
  {
    title: "Feedback",
    description: "Share your thoughts, suggestions, or experiences to help us improve.",
    link: "/support/feedback",
    imgId: 6, // Feedback form
  },
  {
    title: "FAQs",
    description: "Browse answers to the most common questions about shopping, orders, and more.",
    link: "/support/faq",
    imgId: 7, // FAQ illustration
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Background Illustration */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://media.istockphoto.com/id/1399563888/vector/colorful-business-contact-and-service-concept.jpg?s=612x612&w=0&k=20&c=OdbfSdde_vMKuqfVDcFxxXbyytbCFGyvbAkU5yv8Kl0="
            alt="Support background"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
          >
            We're Here to Help
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto"
          >
            Choose how you'd like to get support — we're ready to assist you every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Support Options Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              className="group"
            >
              <Link href={option.link}>
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col items-center text-center border border-gray-100 hover:border-blue-300 transform hover:-translate-y-3">
                  <div className="relative w-64 h-64 mb-8 overflow-hidden rounded-2xl">
                    <Image
                      src={`/api/image-proxy?id=${option.imgId}`} // You'd need a proxy or use direct URLs in production
                      alt={option.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{option.description}</p>
                  <span className="mt-6 inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    Get Started →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Our support team is here 24/7 to make sure you have the best experience possible.
            </p>
            <Link
              href="/support/contact"
              className="inline-flex items-center gap-4 px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Contact Support Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}