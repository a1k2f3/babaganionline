// components/hero/Herosection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    image: '/hero.png',
    title: 'Find Your Vibe',
    subtitle: 'New Season Collection with Best Prices & Fast Delivery',
    highlight: 'Across Pakistan',
  },
  {
    image: '/hero2.png',
    title: 'Summer & Winter Must-Haves',
    subtitle: 'Up to 40% OFF',
    highlight: 'Limited Time Only',
  },
  {
    image: '/hero3.png',
    title: 'Street Style Collection',
    subtitle: 'Trendy Looks',
    highlight: 'Free Delivery on Orders Over 5000 PKR',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
            quality={92}
          />

          {/* Improved Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8">
            <div className="max-w-3xl text-center text-white space-y-6">
              {/* Highlight Tag */}
              {slide.highlight && (
                <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium tracking-wide">
                  {slide.highlight}
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl font-light opacity-95 max-w-xl mx-auto">
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-2xl bg-white text-gray-900 hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 shadow-2xl active:scale-95"
                >
                  Shop Now
                </Link>

                <Link
                  href="/categories"
                  className="group inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-2xl border-2 border-white/90 hover:bg-white hover:text-gray-900 transition-all duration-300 active:scale-95"
                >
                  Explore Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modern Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'bg-white w-9 h-3' 
                : 'bg-white/60 hover:bg-white/80 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;