"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  currency: string;
  thumbnail?: string;
  images?: { url: string }[];
}

const fetcher = async (url: string): Promise<{ products?: Product[] }> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to load new arrivals");
  return response.json();
};

export default function DealsSection() {
  const { data, isLoading, error } = useSWR<{ products?: Product[] }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/new/arrival`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  if (error) {
    return (
      <section className="bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm text-slate-600">New arrivals are temporarily unavailable.</p>
      </section>
    );
  }

  const products = data?.products?.slice(0, 10) ?? [];
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Baba Gani Online
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            New arrivals
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => {
              const image = product.thumbnail || product.images?.[0]?.url;
              const hasDiscount =
                product.discountPrice !== undefined &&
                product.discountPrice > 0 &&
                product.discountPrice < product.price;
              const salePrice =
                hasDiscount && product.discountPrice !== undefined
                  ? product.discountPrice
                  : product.price;
              const discountPercent =
                hasDiscount && product.discountPrice !== undefined
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : 0;

              return (
                <article key={product._id} className="group">
                  <Link href={`/product/${product._id}`} className="block h-full">
                    <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-400">
                      <div className="relative aspect-square bg-slate-100">
                        {image && (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        )}
                        {hasDiscount && (
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
                            {product.currency}{" "}
                            {salePrice.toLocaleString("en-PK")}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-500 line-through">
                              {product.currency} {product.price.toLocaleString("en-PK")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
