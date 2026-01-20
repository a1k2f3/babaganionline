"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
  discountPrice?: number;     // ← final discounted price (e.g. 2499 instead of percentage)
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
      fallbackData: [],
    }
  );

  const products: Product[] = data ? data.flatMap((page) => page.data || []) : [];

  const isLoadingMore = isValidating && data && data.length === size;
  const hasMore = products.length < 100; // reasonable cap for random endpoint

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
      rootMargin: "300px",
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  if (isLoading && products.length === 0) {
    return (
      <section className="py-20 px-4 gap-10 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
          <p className="mt-6 text-xl font-medium text-gray-700">
            Loading amazing products...
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
            Something went wrong while loading products.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative text-center mb-16 pt-12 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl animate-pulse" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of premium items
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-2xl font-medium">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={`${product._id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.03 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-16">
                {isLoadingMore ? (
                  <div className="flex items-center gap-4 text-indigo-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-lg font-medium">Loading more products...</span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Scroll down for more</p>
                )}
              </div>
            )}

            {/* End message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg font-medium">
                  You've seen all our featured products! ✨
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}