// components/sections/CategoriesSection.tsx
"use client";

import CategoryCard from "./CateGoryCard"; // Make sure path & case is correct
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) throw new Error("API base URL not defined");

        const res = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
          next: { revalidate: 3600 },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const result = await res.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid data format");
        }

        setCategories(result.data);
      } catch (err: any) {
        console.error("Categories fetch error:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Check scrollability
  const updateScrollButtons = useCallback(() => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateScrollButtons();
    carousel.addEventListener("scroll", updateScrollButtons);

    const checkOnResize = () => updateScrollButtons();
    window.addEventListener("resize", checkOnResize);

    return () => {
      carousel.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", checkOnResize);
    };
  }, [categories.length, updateScrollButtons]);

  // Smooth scroll function
  const scroll = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    const newScroll =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (categories.length <= 6 || loading) return;

    const interval = setInterval(() => {
      if (!carouselRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const nearEnd = scrollLeft >= scrollWidth - clientWidth - 50;

      if (nearEnd) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [categories.length, loading, scroll]);

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Shop by Category
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-64 h-56 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 px-6 bg-gray-50 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-8 bg-red-50 rounded-2xl border border-red-200"
        >
          <p className="text-red-700 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Retry
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
        >
          
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our handpicked collections
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition md:left-4"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} className="text-gray-800" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition md:right-4"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} className="text-gray-800" />
          </button>
        )}

        {/* Carousel Items */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-8 py-4 snap-x snap-mandatory"
        >
          {categories.map((cat, index) => (
            
            <motion.div
              key={cat._id}
              className="flex-shrink-0 w-[215px] xs:w-[240px] sm:w-64 md:w-72 snap-start"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <CategoryCard
                name={cat.name}
                slug={cat.slug}
                imageUrl={cat.image.url}
                productCount={cat.productCount}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      {categories.length > 6 && (
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            View All Categories
            <ChevronRight size={20} />
          </Link>
        </div>
      )}

      {/* Stats - currently empty */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center"
      >
        {/* You can add stats here later */}
      </motion.div>
    </section>
  );
}