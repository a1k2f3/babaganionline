"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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

  useEffect(() => {
    if (!products.length) {
      timeLeftRef.current = {};
      return;
    }

    let shouldUpdate = false;

    products.forEach((product) => {
      if (!(product._id in timeLeftRef.current)) {
        timeLeftRef.current[product._id] = Math.floor(Math.random() * 36000) + 7200;
        shouldUpdate = true;
      }
    });

    Object.keys(timeLeftRef.current).forEach((id) => {
      if (!products.some((p) => p._id === id)) {
        delete timeLeftRef.current[id];
      }
    });

    if (shouldUpdate) forceUpdate({});
  }, [products]);

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

      if (hasActive) forceUpdate({});
      else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (error) {
    console.error("Deals fetch error:", error);
    return <div className="text-center py-20 text-red-500">Failed to load deals.</div>;
  }
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium text-gray-400">
          No flash deals right now. Stay tuned! 🔥
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product) => {
        const hasDiscount = product.discountPrice && product.discountPrice < product.price;
        const displayPrice = hasDiscount ? product.discountPrice : product.price;
        const discountPercent = hasDiscount
          ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
          : 0;

        const remainingSeconds = timeLeftRef.current[product._id] ?? 0;

        return (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="group block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-square">
                <Image
                  src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercent}%
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-2 h-2 bg-black rounded-full animate-ping" />
                  FLASH
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {product.currency} {displayPrice}
                    </span>

                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.currency} {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 bg-gray-900 text-white text-center rounded py-1.5">
                  <p className="text-xs font-mono font-bold">
                    {formatTime(remainingSeconds)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}