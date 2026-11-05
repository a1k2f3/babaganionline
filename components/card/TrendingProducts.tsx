"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import ProductCard from "../featureproducts/ProductCard";

interface Image {
  url: string;
  public_id: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  name: string;
}

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  images: Image[];
  category: Category;
  brand: Brand;
  tags: Tag[];
}

const PRODUCTS_PER_PAGE = 8;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  });

export default function TrendingProductsSection() {
  const [loadError, setLoadError] = useState(false);
  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite(
    (pageIndex) =>
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/random?limit=${PRODUCTS_PER_PAGE}&page=${pageIndex + 2}`,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const products: Product[] = data ? data.flatMap((page) => page.data || []) : [];

  const isLoadingMore = isValidating && size > 1;
  const lastPageProducts = data?.[data.length - 1]?.data ?? [];
  const hasMore = products.length < 24 && lastPageProducts.length === PRODUCTS_PER_PAGE;

  // Initial Loading
  if (isLoading && products.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-16 h-16 animate-spin text-orange-600 dark:text-orange-500" />
          <p className="mt-6 text-sm font-medium text-slate-600">
            Loading products...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 text-center">
        <div className="max-w-md mx-auto">
          <p className="mb-3 text-lg font-semibold text-slate-900">
            Failed to load trending products
          </p>
          <p className="mb-8 text-sm text-slate-600">
            Please try again later
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Baba Gani Online
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              More products
            </h2>
          </div>
          <Sparkles className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-slate-500">
              No products found at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center gap-3 pt-8">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={() => {
                    setLoadError(false);
                    void setSize((prev) => prev + 1).catch(() => setLoadError(true));
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-500 disabled:cursor-wait disabled:opacity-60"
                >
                  {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoadingMore ? "Loading..." : "Load more products"}
                </button>
                {loadError && <p className="text-sm text-red-700">Could not load more products. Please try again.</p>}
              </div>
            )}

          </>
        )}
      </div>
    </section>
  );
}