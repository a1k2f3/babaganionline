"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Flame, Loader2, Sparkles } from "lucide-react";
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

const PRODUCTS_PER_PAGE = 12;

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
    }
  );

  const products: Product[] = data ? data.flatMap((page) => page.data || []) : [];

  const isLoadingMore = isValidating && size > 0;
  const hasMore = products.length < 100;

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

  // Initial Loading
  if (isLoading && products.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-16 h-16 animate-spin text-orange-600 dark:text-orange-500" />
          <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">
            Loading trending products...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4 text-center bg-white dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <p className="text-6xl mb-4">🔥</p>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-3">
            Failed to load trending products
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please try again later
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-2xl transition-all active:scale-95"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Trending Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <Flame className="w-12 h-12 text-orange-500" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white mb-4"
          >
            Trending Now
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            Hot picks • Real-time updates • Limited stock
          </motion.p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl text-gray-500 dark:text-gray-400">
              No trending products right now. Check back soon!
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
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.03, 0.6),
                  }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-20">
                {isLoadingMore ? (
                  <div className="flex items-center gap-3 text-orange-600 dark:text-orange-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-lg font-medium">Loading more trending items...</span>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 flex items-center gap-2 text-sm">
                    Scroll for more trending finds <span className="text-base">↓</span>
                  </p>
                )}
              </div>
            )}

            {/* End Message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-3 px-10 py-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-3xl">
                  <Flame className="w-10 h-10 text-orange-500" />
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                    You've seen all trending products for now!
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    New trending items are added regularly ✨
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