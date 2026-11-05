"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Product {
  stock: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  currency: string;
  thumbnail: string;
  images: { url: string }[];
  category?: { name: string } | null;
  brand?: { name: string } | null;
  tags: { name: string; color?: string }[];
}

interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  total?: number;
  data: Product[];
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [results, setResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const limit = 20;

  useEffect(() => {
    const controller = new AbortController();

    if (!query) {
      setResults([]);
      setTotalResults(0);
      setFetchError(false);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchResults = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=${limit}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch search results");

        const data: SearchResponse = await res.json();

        if (isMounted) {
          setResults(data.data || []);
          setTotalResults(data.total || data.count || 0);
        }
      } catch (error: unknown) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error("Search error:", error);
          if (isMounted) {
            setResults([]);
            setTotalResults(0);
            setFetchError(true);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [query, currentPage]);

  const totalPages = Math.ceil(totalResults / limit);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    window.location.search = params.toString();
  };

  const visiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta > 2) {
      pages.push(1, "...");
    } else if (totalPages >= 1) {
      pages.push(1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("...", totalPages);
    } else if (totalPages > end) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-7 border-b border-slate-200 pb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 ring-1 ring-slate-200">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {query ? `Results for “${query}”` : "Search products"}
              </h1>
              <p className="mt-2 text-sm text-slate-600" aria-live="polite">
                {loading
                  ? "Searching products..."
                  : query
                    ? `${totalResults} ${totalResults === 1 ? "product" : "products"} found`
                    : "Enter a search term to find products."}
              </p>
            </div>
          </div>
        </header>

        {fetchError && !loading && (
          <div role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-sm text-red-700">
            Search results could not be loaded. Please try again.
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product) => {
                const price = Number(product.price) || 0;
                const discountPrice = Number(product.discountPrice) || 0;
                const hasDiscount = discountPrice > 0 && discountPrice < price;
                const displayPrice = hasDiscount ? discountPrice : price;
                const discountPercent = hasDiscount
                  ? Math.round(((price - discountPrice) / price) * 100)
                  : 0;

                return (
                    <article key={product._id} className="group h-full">
                    <Link href={`/product/${product._id}`} className="block h-full">
                      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-400">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          <Image
                            src={product.thumbnail || "/images/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 475px) 45vw, (max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            priority={false}
                          />

                          {product.stock === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                              <span className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">Sold out</span>
                            </div>
                          )}

                          {product.stock > 0 && product.stock <= 5 && (
                            <div className="absolute left-2 top-2 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-900">
                              Only {product.stock} left
                            </div>
                          )}

                          {hasDiscount && discountPercent >= 5 && (
                            <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-900">
                              {discountPercent}% OFF
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col space-y-2 p-3 sm:p-4">
                          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800 group-hover:text-slate-950">
                            {product.name}
                          </h3>

                          {(product.brand?.name || product.category?.name) && (
                            <p className="line-clamp-1 text-xs text-slate-500">
                              {product.brand?.name}
                              {product.brand?.name && product.category?.name && " • "}
                              {product.category?.name}
                            </p>
                          )}

                          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-base font-semibold text-slate-950">
                              {product.currency || "PKR"} {displayPrice.toLocaleString("en-PK")}
                            </span>

                            {hasDiscount && (
                              <span className="text-xs text-slate-500 line-through">
                                {product.currency || "PKR"} {price.toLocaleString("en-PK")}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-300 disabled:opacity-40 disabled:hover:bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> First
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition shadow-sm font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Prev
                </button>

                <div className="flex gap-2 sm:gap-2.5 flex-wrap justify-center">
                  {visiblePages().map((page, idx) =>
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-4 py-3 text-gray-400 font-medium">
                        …
                      </span>
                    ) : (
                      <button
                        type="button"
                        key={page}
                        onClick={() => goToPage(page as number)}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`min-w-[42px] sm:min-w-[48px] py-3 rounded-xl font-medium transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition shadow-sm font-medium"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-300 disabled:opacity-40 disabled:hover:bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm"
                >
                  Last <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* No query */}
        {!loading && !query && (
          <div className="text-center py-24 sm:py-32">
            <Search className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Start Searching</h2>
            <p className="text-lg sm:text-xl text-gray-600">Type something in the search bar to find products.</p>
          </div>
        )}

        {/* No results */}
        {!loading && !fetchError && query && results.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center sm:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Package className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-950">
              No results for “{query}”
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Try different keywords, check spelling, or browse our categories.
            </p>
            <Link
              href="/categories"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Browse categories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchResultsClient() {
  return <SearchResultsContent />;
}