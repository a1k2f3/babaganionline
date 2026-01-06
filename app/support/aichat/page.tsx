// app/support/page.tsx (or wherever your chat support page is)
"use client";
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Headphones, Mail, Bot, Sparkles, Clock, Shield } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <h1 className="text-center text-4xl font-bold text-gray-900 py-20">Coming Soon !</h1>
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="w-5 h-5" />
              <span>AI-Powered Support</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Hi! How can we help you today?
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Our smart AI assistant is here 24/7 to answer your questions about orders, products, shipping, returns, and more.
            </p>

            {/* Chat Bubble Simulation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  AI
                </div>
                <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-md">
                  <p className="text-gray-800">
                    Hello! 👋 I'm your AI support assistant.  
                    Ask me anything about your order, tracking, products, or account.
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <MessageCircle className="w-6 h-6 inline mr-3" />
                  Start Chat Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <Sparkles className="w-12 h-12 text-indigo-300 opacity-60" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce">
          <MessageCircle className="w-16 h-16 text-purple-300 opacity-50" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Chat with Our AI?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Instant Replies</h3>
              <p className="text-gray-600">Get answers in seconds, any time — day or night.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50"
            >
              <Headphones className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Available</h3>
              <p className="text-gray-600">We're always here when you need us — no waiting.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50"
            >
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-600">Your conversations are private and never shared.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-gray-600 mb-8">
            Prefer to talk to a human? We're here too!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="mailto:support@yourstore.com"
              className="flex items-center gap-3 px-8 py-4 bg-white rounded-full shadow-md hover:shadow-lg transition"
            >
              <Mail className="w-6 h-6 text-indigo-600" />
              <span className="font-medium">Email Us</span>
            </a>

            <a
              href="/support/contact"
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition"
            >
              <Headphones className="w-6 h-6" />
              <span className="font-medium">Live Human Support</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}