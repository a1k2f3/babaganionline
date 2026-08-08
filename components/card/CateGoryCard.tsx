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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative h-52 w-40 sm:h-56 sm:w-44"
    >
      <Link
        href={`/categories/${slug}`}
        className="block h-full w-full overflow-hidden rounded-[1.7rem] shadow-[0_18px_35px_rgba(15,23,42,0.12)] transition-all duration-300 hover:shadow-[0_22px_40px_rgba(79,70,229,0.18)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.7rem]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 44vw, (max-width: 768px) 24vw, 208px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/55 to-slate-900/10" />

          <div className="absolute right-3 top-3 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {productCount}+ items
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-4 text-left">
            <h3 className="max-w-[80%] text-base font-black leading-tight text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] sm:text-lg">
              {name}
            </h3>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/25">
              <span>Explore</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}