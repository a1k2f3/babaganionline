"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
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

const PRODUCTS_PER_PAGE = 20;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  });

export default function ProductsSection() {
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
    }
  );

  const products: Product[] = data ? data.flatMap((page) => page.data || []) : [];

  const isLoadingMore = isValidating && size > 0;
  const hasMore = products.length < 120; // Increased reasonable limit

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
      rootMargin: "400px",
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Initial Loading State
  if (isLoading && products.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-16 h-16 animate-spin text-violet-600 dark:text-violet-500" />
          <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">
            Loading premium products...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-2 px-4 text-center bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-3">
            Failed to load products
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl transition-all active:scale-95"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-violet-500" />
            <span className="uppercase tracking-[3px] text-sm font-semibold text-violet-600 dark:text-violet-400">
              New Arrivals
            </span>
            <Sparkles className="w-8 h-8 text-violet-500" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Featured Products
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Handpicked premium products just for you
          </motion.p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl text-gray-500 dark:text-gray-400">
              No products found at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 sm:gap-7">
              {products.map((product, index) => (
                <motion.div
                  key={`${product._id}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.025, 0.6) }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-20">
                {isLoadingMore ? (
                  <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-lg font-medium">Loading more amazing products...</span>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-2">
                    Keep scrolling to discover more <span className="text-base">↓</span>
                  </p>
                )}
              </div>
            )}

            {/* End Message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    You've explored all our featured products ✨
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}