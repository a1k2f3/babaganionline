"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Heart, Users, Star } from 'lucide-react';



export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      desc: "We constantly explore new technologies and ideas to stay ahead of the curve.",
    },
    {
      icon: Shield,
      title: "Quality & Reliability",
      desc: "Delivering secure, scalable, and high-performance solutions every time.",
    },
    {
      icon: Heart,
      title: "User-First Approach",
      desc: "Your needs and experience are at the center of everything we build.",
    },
    {
      icon: Users,
      title: "Collaboration",
      desc: "We work as partners, not just vendors — your success is our success.",
    },
  ];

  const timeline = [
    { year: "2024", event: "Company Founded", desc: "Started with a small passionate team and big dreams." },
    { year: "2025", event: "First Major Launch", desc: "Delivered groundbreaking e-commerce platform for key clients." },
    { year: "2026", event: "Rapid Growth", desc: "Expanded team and capabilities to serve global customers." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              We build modern, beautiful, and high-performance digital experiences that help businesses thrive in the digital age.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Work With Us
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#story"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-md"
              >
                Our Journey
                <Star className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-10 text-white shadow-2xl"
            >
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed opacity-95">
                To empower businesses and individuals with cutting-edge, intuitive, and reliable digital solutions that drive real growth, simplify complexity, and create lasting impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-10 text-white shadow-2xl"
            >
              <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl leading-relaxed opacity-95">
                A future where technology seamlessly enhances human potential — making life simpler, businesses stronger, and connections deeper through thoughtful innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section id="story" className="py-20 px-6 bg-gray-100/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Journey So Far
            </h2>
            <p className="text-xl text-gray-600">From a bold idea to a trusted partner</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              >
                <div className="text-5xl font-bold text-blue-600 mb-4">{item.year}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.event}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {index < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Placeholder / CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
              Whether you're a business looking for a reliable tech partner or a talented individual wanting to make an impact — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Get in Touch
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}