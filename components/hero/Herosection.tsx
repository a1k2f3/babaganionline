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
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-black/30" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8">
            <div className="max-w-3xl text-center text-white space-y-6">
              {/* Highlight Tag */}
              {slide.highlight && (
                <div className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/12 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md shadow-lg shadow-slate-950/20">
                  {slide.highlight}
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.06em] leading-[0.95] text-white drop-shadow-[0_8px_24px_rgba(15,23,42,0.45)]">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto max-w-xl text-lg font-medium text-slate-100/90 sm:text-xl md:text-2xl">
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 px-8 py-3.5 text-base font-bold text-slate-900 shadow-[0_18px_35px_rgba(251,191,36,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(251,191,36,0.52)] active:scale-95"
                >
                  Shop Now
                </Link>

                <Link
                  href="/categories"
                  className="group inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/8 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 active:scale-95"
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