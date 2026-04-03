"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Clock, Loader2 } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  currency: string;
  stock: number;
  thumbnail?: string;
  images?: { url: string }[];
  slug?: string;
  createdAt: string;
}

export default function DealsSection() {
  const timeLeftRef = useRef<Record<string, number>>({});
  const [_, forceUpdate] = useState({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/new/arrival`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const products: Product[] = data?.products || [];

  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  // Initialize countdown timers
  useEffect(() => {
    if (!products.length) {
      timeLeftRef.current = {};
      return;
    }

    let shouldUpdate = false;

    products.forEach((product) => {
      if (!(product._id in timeLeftRef.current)) {
        // Random countdown between 2 to 12 hours
        timeLeftRef.current[product._id] = Math.floor(Math.random() * 36000) + 7200;
        shouldUpdate = true;
      }
    });

    // Clean up old timers
    Object.keys(timeLeftRef.current).forEach((id) => {
      if (!products.some((p) => p._id === id)) {
        delete timeLeftRef.current[id];
      }
    });

    if (shouldUpdate) forceUpdate({});
  }, [products]);

  // Countdown Timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      let hasActive = false;

      Object.keys(timeLeftRef.current).forEach((id) => {
        if (timeLeftRef.current[id] > 0) {
          timeLeftRef.current[id] -= 1;
          hasActive = true;
        } else {
          timeLeftRef.current[id] = 0;
        }
      });

      if (hasActive) {
        forceUpdate({});
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Hide entire section if no products
  if (error || products.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/30 dark:via-gray-900 dark:to-orange-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Flame className="w-8 h-8 text-red-600 animate-pulse" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Flash Deals</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/30 dark:via-gray-900 dark:to-orange-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Flame className="w-10 h-10 text-red-600" />
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Flash Deals
            </h2>
            <Flame className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Limited time offers • Prices drop every hour
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7">
          {products.map((product, index) => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const displayPrice = hasDiscount ? product.discountPrice! : product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
              : 0;

            const remainingSeconds = timeLeftRef.current[product._id] ?? 0;
            const isExpired = remainingSeconds <= 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                <Link href={`/product/${product._id}`} className="group block">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group-hover:ring-2 group-hover:ring-red-500/30">
                    <div className="relative aspect-square">
                      <Image
                        src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          -{discountPercent}%
                        </div>
                      )}

                      {/* Flash Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                        <Clock className="w-3 h-3" />
                        FLASH
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[42px] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {product.name}
                      </h3>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-green-600 dark:text-green-500">
                          {product.currency} {displayPrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.currency} {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Countdown Timer */}
                      <div className="mt-4 bg-gray-900 dark:bg-black text-white text-center py-2.5 rounded-2xl text-xs font-mono tracking-wider">
                        {isExpired ? (
                          <span className="text-red-400 font-medium">Deal Expired</span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatTime(remainingSeconds)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}