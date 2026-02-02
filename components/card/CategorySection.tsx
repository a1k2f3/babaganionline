// components/sections/CategoriesSection.tsx
"use client";

import CategoryCard from "./CateGoryCard"; // fix case if needed: CateGoryCard → CategoryCard
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

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

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid categories data format");
        }

        // Take only first 12
        setCategories(result.data.slice(0, 12));
      } catch (err: any) {
        console.error("Categories fetch error:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-5 md:px-8 bg-gray-50">
        <div className="text-center mb-10">
         
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6 max-w-7xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="h-64 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-6 bg-gray-50 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-10 bg-red-50 rounded-2xl border border-red-200"
        >
          <p className="text-red-700 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </motion.div>
      </section>
    );
  }

  const showViewAll = categories.length === 12; // or always show if you prefer

  return (
    <section className="py-16 px-5 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="text-center mb-12 md:mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
        >
          Shop by Category
        </motion.h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our curated collections
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6 max-w-7xl mx-auto">
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.05,
              duration: 0.5,
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

      {/* View All Button */}
      {showViewAll && (
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Categories
            <ChevronRight size={22} />
          </Link>
        </div>
      )}
    </section>
  );
}