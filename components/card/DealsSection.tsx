// components/card/DealsSection.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  slug?: string;
  name: string;
  price: number;
  thumbnail?: string;
  images?: { url: string }[];
}

export default function DealsSection() {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef<string>("");

  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?tags=70-off`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Prevent rapid refetches
    }
  );

  const products: Product[] = data?.data || [];

  // Stable format function
  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  // Initialize timers ONLY when products first load or change significantly
  useEffect(() => {
    if (!products.length) {
      setTimeLeft({});
      return;
    }

    // Create a stable key from product IDs to detect real changes
    const productIds = products.map(p => p._id).sort().join(",");

    // Use a ref to avoid re-initializing on every minor re-render
    if (initializedRef.current && initializedRef.current === productIds) {
      return; // Same products — do nothing
    }

    initializedRef.current = productIds;

    setTimeLeft(prev => {
      const next: Record<string, number> = {};

      products.forEach(product => {
        // Keep existing countdown if product was already there
        if (prev[product._id] > 0) {
          next[product._id] = prev[product._id];
        } else {
          // New product → random 2h to 12h
          next[product._id] = Math.floor(Math.random() * 36000) + 7200;
        }
      });

      return next;
    });
  }, [products]);

  // Single global countdown ticker — runs once
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const updated = { ...prev };
        let hasActive = false;

        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] -= 1;
            hasActive = true;
          } else {
            updated[id] = 0;
          }
        });

        if (!hasActive) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }

        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Only once!

  // Error handling
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
        const originalPrice = Math.round(product.price / 0.3);
        const remainingSeconds = timeLeft[product._id] ?? 0;

        return (
          <Link
            key={product._id}
            href={`/product/${product.slug || product._id}`}
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

                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  -70%
                </div>

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
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      RS {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-2">
                      RS {originalPrice.toLocaleString()}
                    </span>
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