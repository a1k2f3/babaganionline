"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    <article className="group w-36 shrink-0 sm:w-full">
      <Link
        href={`/categories/${slug}`}
        className="block h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-400"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 36vw, (max-width: 1024px) 28vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
            <div>
              <h3 className="text-sm font-semibold leading-5">{name}</h3>
              <p className="mt-1 text-xs text-white/80">{productCount} items</p>
            </div>
            <ArrowRight
              size={16}
              className="mb-0.5 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
