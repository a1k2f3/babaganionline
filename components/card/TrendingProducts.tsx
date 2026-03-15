"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Flame, Loader2 } from "lucide-react"; // ← added Flame icon for trending feel
import useSWRInfinite from "swr/infinite";
import ProductCard from "../featureproducts/ProductCard";

interface Image {
  url: string;
  public_id: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  name: string;
}

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  images: Image[];
  category: Category;
  brand: Brand;
  tags: Tag[];
}

const PRODUCTS_PER_PAGE = 12; // reduced a bit for better performance on trending

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  });

export default function TrendingProductsSection() {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite(
    (pageIndex) =>
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/random?limit=${PRODUCTS_PER_PAGE}&page=${pageIndex + 1}`,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      fallbackData: [],
    }
  );

  const products: Product[] = data ? data.flatMap((page) => page.data || []) : [];

  const isLoadingMore = isValidating && data && data.length === size;
  const hasMore = products.length < 120; // slightly higher cap for trending feel

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        setSize((prev) => prev + 1);
      }
    },
    [hasMore, isLoadingMore, setSize]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "400px", // load earlier
      threshold: 0.1,
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  if (isLoading && products.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/40 via-white to-white">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-16 h-16 animate-spin text-orange-600" />
          <p className="mt-6 text-xl font-medium text-gray-700">
            Loading trending items...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-red-600 text-2xl font-semibold mb-4">Oops!</p>
          <p className="text-gray-700 text-lg mb-8">
            Couldn't load trending products right now.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition shadow-lg"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-orange-50/30 via-white to-white pb-24 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header – Trending style */}
        <div className="relative text-center mb-16">
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame className="w-10 h-10 text-orange-600 animate-pulse" />
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Trending Products
              </h2>
              <Flame className="w-10 h-10 text-orange-600 animate-pulse" />
            </div>

            <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
              Hot right now • Updated in real-time • Don't miss out!
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-2xl font-medium">
              No trending products at the moment... check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 lg:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={`${product._id}-${index}`}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(index * 0.06, 0.8),
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="transform-gpu"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-20">
                {isLoadingMore ? (
                  <div className="flex items-center gap-4 text-orange-600">
                    <Loader2 className="w-9 h-9 animate-spin" />
                    <span className="text-xl font-medium">Loading more hot items...</span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-base italic">
                    Scroll down to discover more trending finds 🔥
                  </p>
                )}
              </div>
            )}

            {/* End of content message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-xl font-medium">
                  You've reached the end of today's trending picks! ✨
                </p>
                <p className="text-gray-500 mt-2">
                  New hot products added regularly — come back soon!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}