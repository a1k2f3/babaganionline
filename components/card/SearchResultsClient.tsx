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
    } else {
      pages.push(1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("...", totalPages);
    } else if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg mb-6"
          >
            <Search className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Results for: <span className="text-indigo-600">"{query}"</span>
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600">
            {loading ? "Searching..." : `${totalResults} product${totalResults !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-6" />
            <p className="text-xl text-gray-700">Finding the best matches...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {results.map((product, index) => {
                const price = Number(product.price) || 0;
                const discountPrice = Number(product.discountPrice) || 0;

                const hasDiscount =
                  discountPrice > 0 &&
                  discountPrice < price;

                const displayPrice = hasDiscount ? discountPrice : price;
                const discountPercent = hasDiscount
                  ? Math.round(((price - discountPrice) / price) * 100)
                  : 0;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/product/${product._id}`}>
                      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={product.thumbnail || "/images/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            priority={index < 10}
                          />

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <span className="text-white text-lg font-bold">Sold Out</span>
                            </div>
                          )}
                          {product.stock > 0 && product.stock <= 5 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Only {product.stock} left!
                            </div>
                          )}

                          {hasDiscount && discountPercent > 5 && (
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                              {discountPercent}% OFF
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </h3>

                          {(product.brand || product.category) && (
                            <p className="text-sm text-gray-500 mb-2">
                              {product.brand?.name}
                              {product.brand && product.category && " • "}
                              {product.category?.name}
                            </p>
                          )}

                          {/* Safe Price Display */}
                          <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                            <span className="text-2xl font-extrabold text-red-600">
                              {product.currency || "PKR"}{" "}
                              {displayPrice.toLocaleString("en-IN")}
                            </span>

                            {hasDiscount && (
                              <span className="text-lg text-gray-500 line-through opacity-80">
                                {product.currency || "PKR"}{" "}
                                {price.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {product.tags.slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
                                  style={{ backgroundColor: tag.color || "#6366f1" }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                              {product.tags.length > 2 && (
                                <span className="text-xs text-gray-500 self-center">
                                  +{product.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {visiblePages().map((page, i) =>
                    page === "..." ? (
                      <span key={i} className="px-4 py-3 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page as number)}
                        className={`px-5 py-3 rounded-xl font-medium transition min-w-[44px] ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "bg-white border border-gray-300 hover:bg-indigo-50"
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
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-md"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty States */}
        {!loading && !query && (
          <div className="text-center py-32">
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Searching</h2>
            <p className="text-xl text-gray-600">Type something in the search bar to find products.</p>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-32">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No results for "{query}"
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <Loader2 className="w-20 h-20 animate-spin text-indigo-600 mb-8" />
            <p className="text-2xl text-gray-700">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}