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
  const safeImage = product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg";
  const safeCategory = product.category?.name || "Uncategorized";
  const safeBrand = product.brand?.name || "Brand";
  const firstTag = product.tags?.[0];
  const displayRating = product.rating || 4.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group w-full max-w-sm mx-auto"
    >
      <Link href={`/product/${product._id}`}>
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300">
          
          {/* Image */}
          <div className="relative aspect-square">
            <Image
              src={safeImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Tag Badge */}
            {firstTag && (
              <span
                className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white shadow"
                style={{ backgroundColor: firstTag.color || "#4f46e5" }}
              >
                {firstTag.name.toUpperCase()}
              </span>
            )}

            {/* Quick Add Button */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 shadow-lg font-medium text-sm hover:bg-gray-100">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-500">{safeCategory} • {safeBrand}</p>
            
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">
                RS {product.price.toLocaleString("en-IN")}
              </p>

              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {displayRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}