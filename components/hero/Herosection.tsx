// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    image: '/hero.png',
    title: 'Find Your Vibe',
    subtitle: 'New Season • Best Prices • Fast Delivery',
  },
  {
    image: '/hero2.png',
    title: 'Summer and Winter Must-Haves',
    subtitle: 'Up to 10 to 40% Off on every single product Limited Time Only',
  },
  {
    image: '/hero3.png',
    title: 'Street Style Collection',
    subtitle: 'Trendy Looks • Free Delivery ',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
      {/* Carousel container - smaller height */}
      <div className="relative aspect-[4/3] sm:aspect-[16/7] md:aspect-[21/8] overflow-hidden rounded-2xl shadow-xl">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover brightness-[0.75]"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 90vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-5 sm:px-8 max-w-2xl md:max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-3 text-base sm:text-lg md:text-xl opacity-90">
                  {slide.subtitle}
                </p>

                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/categories"
                    className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Simple dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;