// components/products/TrendingProducts.tsx
"use client";

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

interface TrendingProductsProps {
  limit?: number;
}

export default function TrendingProducts({ limit = 12 }: TrendingProductsProps) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?tags=trending-now&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  const products: Product[] = data?.data || data || [];

  // Loading State - Realistic skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-lg">Failed to load trending products.</p>
        <p className="text-gray-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No trending products available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product.slug || product._id}`}
          className="group block"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={
                  product.thumbnail ||
                  product.images?.[0]?.url ||
                  "/placeholder.jpg"
                }
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={false}
              />

              {/* Trending Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                TRENDING
              </div>

              {/* Quick View Overlay - Pure CSS */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-100 transition">
                  Quick View
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 text-center">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-indigo-600">
                RS {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}