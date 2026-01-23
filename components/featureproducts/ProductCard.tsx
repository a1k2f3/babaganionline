"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

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
  // If you later want to add flash-deal timer per product, you can add:
  // isFlash?: boolean;
}

interface ProductCardProps {
  product: Product;
  showFlashBadge?: boolean; // optional prop — show "FLASH" badge like in deals
}

export default function ProductCard({
  product,
  showFlashBadge = false, // default: false → normal product card
}: ProductCardProps) {
  // Safe fallbacks
  const safeImage = product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg";
  const currency = product.currency || "Rs";

  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice !== undefined ? Number(product.discountPrice) : undefined;

  const hasDiscount = salePrice !== undefined && salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasDiscount ? salePrice : originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const displayRating = product.rating ?? 4.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group block"
    >
      <Link href={`/product/${product._id}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          {/* Image + Badges */}
          <div className="relative aspect-square">
            <Image
              src={safeImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Discount badge - top left - red like DealsSection */}
            {hasDiscount && discountPercent > 5 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                -{discountPercent}%
              </div>
            )}

            {/* Flash / urgency badge - top right */}
            {showFlashBadge && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow z-10">
                <span className="w-2 h-2 bg-black rounded-full animate-ping" />
                FLASH
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors min-h-[2.75rem]">
              {product.name}
            </h3>

            {/* Price row */}
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-green-600">
                  {currency} {finalPrice.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span className="text-xs text-gray-500 line-through ml-1">
                    {currency} {originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Optional small rating - can remove if not needed */}
              {/* <div className="flex items-center text-xs text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="ml-1">{displayRating.toFixed(1)}</span>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}