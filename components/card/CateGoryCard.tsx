// components/card/CategoryCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

export default function CategoryCard({
  name,
  slug,
  imageUrl,
  productCount,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      className="group relative w-34 h-34 sm:w-38 sm:h-38 md:w-42 md:h-42"
    >
      <Link
        href={`/categories/${slug}`}
        className="block w-full h-full rounded-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative w-full h-full rounded-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 44vw, (max-width: 768px) 24vw, 208px"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-full pointer-events-none" />

          {/* Main content - bottom aligned */}
          <div className="absolute inset-0 flex flex-col justify-end items-center pb-5 px-3.5 text-center">
            <h3 className="text-white text-base sm:text-lg font-bold drop-shadow leading-tight line-clamp-2">
              {name}
            </h3>
{/* 
            <div className="mt-1 flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium">
              <ShoppingBag size={13} />
              <span>{productCount}</span>
            </div> */}

            <div className="mt-1.5 flex items-center text-white/80 text-xs">
              <span>Explore</span>
              <ArrowRight
                size={14}
                className="ml-1 group-hover:translate-x-1.5 transition-transform"
              />
            </div>
          </div>

          {/* Small badge top-right */}
         
        </div>
      </Link>
    </motion.div>
  );
}