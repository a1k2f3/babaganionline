"use client";

import CategoryCard from "@/components/card/CatagoryCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const categories = result.data;

          // Show first 10 immediately
          setVisibleCategories(categories.slice(0, 10));

          // Then reveal the rest smoothly
          setTimeout(() => {
            setAllCategories(categories);
            setVisibleCategories(categories);
          }, 600);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Fetch failed:", err.message);
        setError("Failed to load categories");
        setVisibleCategories([]);
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoriesToShow = visibleCategories.length > 10 ? visibleCategories : allCategories;

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("desktop-category-carousel");
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll ~80% of viewport
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-32 h-40 md:w-48 md:h-56 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="py-16 px-6 md:py-20 bg-gray-50 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900"
      >
        Shop by Category
      </motion.h2>

      {/* Mobile: Horizontal Scroll (Touch-friendly) */}
      <div className="flex md:hidden overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide px-4">
        {categoriesToShow.map((cat, index) => (
          <motion.div
            key={cat._id}
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index < 10 ? index * 0.05 : (index - 10) * 0.05 + 0.6 }}
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

      {/* Desktop: Beautiful Horizontal Carousel with Arrows */}
      <div className="hidden md:block relative max-w-7xl mx-auto px-8">
        {/* Left Arrow */}
        <button
          onClick={() => scrollContainer("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-7 h-7 text-gray-800" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scrollContainer("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-7 h-7 text-gray-800" />
        </button>

        {/* Carousel Container */}
        <div
          id="desktop-category-carousel"
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categoriesToShow.map((cat, index) => (
            <motion.div
              key={cat._id}
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index < 10 ? index * 0.08 : (index - 10) * 0.08 + 0.6,
                duration: 0.6,
              }}
            >
              <div className="w-56"> {/* Fixed width for consistent scrolling */}
                <CategoryCard
                  name={cat.name}
                  slug={cat.slug}
                  imageUrl={cat.image.url}
                  productCount={cat.productCount}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}