// components/sections/CategoriesSection.tsx
"use client";

import CategoryCard from "./CateGoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

type SortOption = "name-asc" | "name-desc" | "count-desc" | "count-asc";

const ITEMS_PER_PAGE = 12;

export default function CategoriesSection() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) throw new Error("API base URL not defined");

        const res = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
          next: { revalidate: 3600 },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid data format");
        }

        setAllCategories(result.data);
      } catch (err: any) {
        console.error("Categories fetch error:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Filtered + sorted + paginated
  const { displayedCategories, totalPages } = useMemo(() => {
    let filtered = allCategories;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(query)
      );
    }

    // Sort
    let sorted = [...filtered];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "count-desc":
        sorted.sort((a, b) => b.productCount - a.productCount);
        break;
      case "count-asc":
        sorted.sort((a, b) => a.productCount - b.productCount);
        break;
    }

    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

    // Paginate
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = sorted.slice(start, start + ITEMS_PER_PAGE);

    return {
      displayedCategories: paginated,
      totalPages: pages,
    };
  }, [allCategories, searchQuery, sortBy, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <section className="py-16 px-5 sm:px-6 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Shop by Category
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="h-64 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 bg-gray-50 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-8 bg-red-50 rounded-2xl border border-red-200"
        >
          <p className="text-red-700 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Retry
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 px-5 sm:px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto mb-10 md:mb-14">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3"
          >
            Shop by Category
          </motion.h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover our curated collections
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 md:gap-6">
          <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative inline-block text-left w-full sm:w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex w-full justify-between items-center gap-x-2 rounded-full bg-white dark:bg-gray-800 px-5 py-3 text-base font-medium text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <span>
                {sortBy === "name-asc" && "Sort: Name (A-Z)"}
                {sortBy === "name-desc" && "Sort: Name (Z-A)"}
                {sortBy === "count-desc" && "Sort: Most Products"}
                {sortBy === "count-asc" && "Sort: Fewest Products"}
              </span>
              {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="py-2">
                    {[
                      { value: "name-asc", label: "Name (A-Z)" },
                      { value: "name-desc", label: "Name (Z-A)" },
                      { value: "count-desc", label: "Most Products First" },
                      { value: "count-asc", label: "Fewest Products First" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {displayedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 dark:text-gray-400"
          >
            <p className="text-xl">
              No categories found matching "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 md:gap-7">
            <AnimatePresence mode="wait">
              {displayedCategories.map((cat, index) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                >
                  <CategoryCard
                    name={cat.name}
                    slug={cat.slug}
                    imageUrl={cat.image.url}
                    productCount={cat.productCount}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 md:mt-16 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, idx, arr) => {
                const showEllipsis =
                  idx > 0 &&
                  arr[idx - 1] !== page - 1 &&
                  page !== 1 &&
                  page !== totalPages;

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] h-10 rounded-lg font-medium transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}