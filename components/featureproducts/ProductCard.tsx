"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  name: string;
}

interface ImageObj {
  url: string;
  public_id: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  thumbnail?: string;
  images?: ImageObj[];
  category?: Category | null;
  brand?: Brand | null;
  tags?: Tag[];
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Safe defaults
  const safeImage = product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg";
  const safeCategory = product.category?.name || "Uncategorized";
  const safeBrand = product.brand?.name || "Brand";
  const firstTag = product.tags?.[0];
  const displayRating = product.rating ?? 4.5;

  // Force numbers (protect against string values from API)
  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice !== undefined ? Number(product.discountPrice) : undefined;

  // Determine final price and discount status
  const hasDiscount =
    salePrice !== undefined &&
    salePrice > 0 &&
    salePrice < originalPrice;

  const finalPrice = hasDiscount ? salePrice : originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group w-full max-w-[280px] sm:max-w-sm mx-auto"
    >
      <Link href={`/product/${product._id}`} className="block h-full">
        <div className="h-80 w-40 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-square flex-shrink-0">
            <Image
              src={safeImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />

            {/* Top-left Tag */}
            {firstTag && (
              <span
                className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white shadow-md rounded-full z-10"
                style={{ backgroundColor: firstTag.color || "#6366f1" }}
              >
                {firstTag.name.toUpperCase()}
              </span>
            )}

            {/* Top-right Discount Badge */}
            {hasDiscount && discountPercentage > 5 && (  // hide very small discounts
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}

            
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-4 pt-4 space-y-2.5">
            

            <h3 className="font-medium text-base sm:text-lg text-gray-900 line-clamp-2 min-h-[2.75rem] sm:min-h-[3.25rem]">
              {product.name}
            </h3>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-auto pt-2">
              {/* Price */}
              <div className="flex items-baseline gap-2.5">
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    hasDiscount ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  Rs {finalPrice.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    Rs {originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Rating */}
              
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}