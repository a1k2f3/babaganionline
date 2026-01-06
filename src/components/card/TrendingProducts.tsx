// components/card/TrendingProducts.tsx
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TrendingProducts({ limit = 12 }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Fetch from your actual API
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?tags=trending-now&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg animate-pulse aspect-square"
          />
        ))}
      </div>
    );
  }

  // Handle error
  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load trending products. Please try again later.
      </div>
    );
  }

  // Extract products from API response
  // Adjust based on your actual response structure
  const products = data?.data || data || [];

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No trending products available at the moment.
      </div>
    );
  }

  return (
  <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
      {products.map((product: any) => (
        <Link
          key={product._id}
          href={`/product/${product.slug || product._id}`}
          className="group"
        >
          <div
            className=" rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredId(product._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Product Image */}
            <div className="aspect-square relative">
              <Image
                src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Trending Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h1.114a4 4 0 001.787-.577l.05-.025A2 2 0 0013 15.763v-5.43a2 2 0 011-1.732V7.5a3 3 0 11-6 0v1.333a2 2 0 01-1 1.732z" />
                </svg>
                TRENDING
              </div>

              {/* Quick View Button on Hover */}
              <button
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 px-6 py-3 rounded-full text-sm font-medium ${
                  hoveredId === product._id
                    ? "opacity-100 translate-y-0 bg-black/80 text-white backdrop-blur"
                    : "opacity-0 translate-y-4"
                }`}
              >
                Quick View
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 text-center">
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-800">
                {product.name}
              </h3>
              <p className="text-lg font-bold mt-2 text-indigo-600">
                RS {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}