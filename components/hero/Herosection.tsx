// components/HeroSection.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background Image - Replace with your own hero image */}
      <Image
        src="/images/hero-bg.jpg" // Place your hero image in public/images/hero-bg.jpg
        alt="E-Shop Hero Banner"
        fill
        priority
        className="object-cover object-center brightness-75"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center text-white px-6 md:px-12 max-w-4xl">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Discover Your Style
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl mb-8 opacity-90">
            Shop the latest trends in fashion, electronics, home essentials & more at unbeatable prices.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-4 rounded-md hover:bg-gray-100 transition transform hover:scale-105 text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/categories"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-md hover:bg-white hover:text-gray-900 transition transform hover:scale-105 text-lg"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Optional: Small scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;