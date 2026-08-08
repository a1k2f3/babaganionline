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
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group block h-full"
    >
      <Link href={`/product/${product._id}`} className="block h-full">
        <div className="h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(79,70,229,0.12)]">
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <Image
              src={safeImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent" />

            {hasDiscount && discountPercent > 5 && (
              <div className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-red-500/30">
                -{discountPercent}%
              </div>
            )}

            {showFlashBadge && (
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900 shadow-lg shadow-orange-500/20">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-slate-900" />
                FLASH
              </div>
            )}
          </div>

          <div className="space-y-3 p-3.5">
            <h3 className="min-h-[2.75rem] text-sm font-semibold leading-5 text-slate-800 transition-colors duration-200 group-hover:text-indigo-600 line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-emerald-600">
                  {currency} {finalPrice.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {currency} {originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {displayRating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}