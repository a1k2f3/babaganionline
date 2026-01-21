"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

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

  const limit = 20;

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
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
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          if (isMounted) {
            setResults([]);
            setTotalResults(0);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="inline-flex items-center gap-3 sm:gap-4 
    bg-white/80 backdrop-blur-sm border border-gray-200/70 
    rounded-full px-5 sm:px-7 py-3 sm:py-3.5 
    shadow-md hover:shadow-lg transition-shadow duration-300"
>
  <Search className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 flex-shrink-0" />
  
  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
    Results for:{" "}
    <span className="text-indigo-600 break-words">"{query}"</span>
  </h1>
</motion.div>
          <p className="text-lg sm:text-xl text-gray-600">
            {loading ? "Searching..." : `${totalResults} product${totalResults !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32">
            <Loader2 className="w-14 h-14 sm:w-16 sm:h-16 animate-spin text-indigo-600 mb-5 sm:mb-6" />
            <p className="text-lg sm:text-xl text-gray-700">Finding the best matches...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-7 lg:gap-8">
              {results.map((product, index) => {
                const price = Number(product.price) || 0;
                const discountPrice = Number(product.discountPrice) || 0;
                const hasDiscount = discountPrice > 0 && discountPrice < price;
                const displayPrice = hasDiscount ? discountPrice : price;
                const discountPercent = hasDiscount
                  ? Math.round(((price - discountPrice) / price) * 100)
                  : 0;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.5 }}
                    className="group flex flex-col h-full"
                  >
                    <Link href={`/product/${product._id}`} className="flex flex-col h-full">
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-200 overflow-hidden flex-1 flex flex-col">
                        {/* Image */}
                        <div className="relative pt-[100%] overflow-hidden bg-gray-50">
                          <Image
                            src={product.thumbnail || "/images/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 475px) 45vw, (max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority={index < 8}
                          />

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                              <span className="text-white text-base sm:text-lg font-bold tracking-wide">Sold Out</span>
                            </div>
                          )}

                          {product.stock > 0 && product.stock <= 5 && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                              Only {product.stock} left
                            </div>
                          )}

                          {hasDiscount && discountPercent >= 5 && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                              {discountPercent}% OFF
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 mb-1.5 group-hover:text-indigo-700 transition-colors">
                            {product.name}
                          </h3>

                          {(product.brand?.name || product.category?.name) && (
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">
                              {product.brand?.name}
                              {product.brand?.name && product.category?.name && " • "}
                              {product.category?.name}
                            </p>
                          )}

                          <div className="mt-auto flex items-baseline gap-2.5 flex-wrap">
                            <span className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight">
                              {product.currency || "PKR"} {displayPrice.toLocaleString("en-IN")}
                            </span>

                            {hasDiscount && (
                              <span className="text-sm sm:text-lg text-gray-500 line-through opacity-75">
                                {product.currency || "PKR"} {price.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-300 disabled:opacity-40 disabled:hover:bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> First
                </button>

                <button
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
                        key={page}
                        onClick={() => goToPage(page as number)}
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
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition shadow-sm font-medium"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
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
        {!loading && query && results.length === 0 && (
          <div className="text-center py-24 sm:py-32">
            <Package className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              No results for "{query}"
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
              Try different keywords, check spelling, or browse our categories.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 animate-spin text-indigo-600 mb-6 sm:mb-8" />
            <p className="text-xl sm:text-2xl text-gray-700">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}