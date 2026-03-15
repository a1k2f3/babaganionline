// components/sections/CategoriesSection.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Required Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import CategoryCard from "./CategoryCard"; 
// // corrected filename case
import CategoryCard from "./CateGoryCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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

        // Still limit to first 12 (or remove .slice() if you want all)
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

  if (loading) {
    return (
      <section className="py-16 px-5 md:px-8 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Shop by Category
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
          >
            {[...Array(8)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse mx-1" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  }

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

  const showViewAll = categories.length === 12;

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

      {/* Carousel */}
      <div className="max-w-7xl mx-auto">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={20}
          slidesPerView={2}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="!pb-12" // extra bottom padding for pagination dots
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={cat._id}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="flex justify-center px-1 pb-4"
              >
                <CategoryCard
                  name={cat.name}
                  slug={cat.slug}
                  imageUrl={cat.image.url}
                  productCount={cat.productCount}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
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