"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";

interface Product {
  stock: number;
  _id: string;
  name: string;
  description: string;
  price: number;
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

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [results, setResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search?q=${encodeURIComponent(
            query
          )}&page=${currentPage}&limit=${limit}`
        );
        const data: SearchResponse = await res.json();

        setResults(data.data || []);
        setTotalResults(data.total || data.count);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const totalPages = Math.ceil(totalResults / limit);

  const updatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-extrabold text-gray-900">
              Search Results for: <span className="text-indigo-600">"{query}"</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {loading ? "Searching..." : `${totalResults} product${totalResults !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-6" />
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {results.map((product) => (
                <Link key={product._id} href={`/product/${product._id}`} className="group block">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                    {/* Image Container */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL="/images/placeholder.jpg" // optional low-res placeholder
                      />

                      {/* Stock Badges */}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">Out of Stock</span>
                        </div>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-4 py-1.5 rounded-full font-semibold shadow-md">
                          Low Stock • {product.stock} left
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-sm text-gray-500 mt-1">{product.brand.name}</p>
                      )}

                      {product.category && (
                        <p className="text-sm text-gray-500">{product.category.name}</p>
                      )}

                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">{product.description}</p>

                      {/* Tags */}
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {product.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                              style={{
                                backgroundColor: tag.color || "#e0e7ff",
                                color: tag.color ? "#ffffff" : "#4f46e5",
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{product.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                          {product.currency} {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => updatePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {getVisiblePages().map((page, i) =>
                    page === "..." ? (
                      <span key={i} className="px-4 py-3 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => updatePage(page as number)}
                        className={`px-5 py-3 rounded-xl transition ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "border border-gray-300 hover:bg-indigo-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => updatePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-3 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-32">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No products found for "{query}"
            </h2>
            <p className="text-lg text-gray-600">Try different keywords or check spelling.</p>
          </div>
        )}
      </div>
    </div>
  );
}