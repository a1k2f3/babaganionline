"use client";

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
  public_id?: string;
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
  const image = product.thumbnail || product.images?.[0]?.url;
  const currency = product.currency || "Rs";
  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice !== undefined ? Number(product.discountPrice) : undefined;
  const hasDiscount = salePrice !== undefined && salePrice > 0 && salePrice < originalPrice;
  const finalPrice = hasDiscount ? salePrice : originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <article className="group h-full">
      <Link href={`/product/${product._id}`} className="block h-full">
        <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-400">
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />
            )}

            {hasDiscount && discountPercent > 0 && (
              <span className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-900">
                -{discountPercent}%
              </span>
            )}

          </div>

          <div className="space-y-2 p-3 sm:p-4">
            <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800 group-hover:text-slate-950">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-base font-semibold text-slate-950">
                {currency} {finalPrice.toLocaleString("en-PK")}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">
                  {currency} {originalPrice.toLocaleString("en-PK")}
                </span>
              )}
            </div>
            {product.rating !== undefined && Number.isFinite(Number(product.rating)) && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                <Star size={13} className="fill-amber-400 text-amber-500" aria-hidden="true" />
                <span>{Number(product.rating).toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
