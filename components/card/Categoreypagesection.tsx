// components/sections/CategoriesSection.tsx
"use client";

import CategoryCard from "./CateGoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

type SortOption = "name-asc" | "name-desc" | "count-desc" | "count-asc";

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch categories (unchanged)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) throw new Error("API base URL not defined");
        const res = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
          next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const result = await res.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid data format");
        }
        setCategories(result.data);
      } catch (err: any) {
        console.error("Categories fetch error:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Combined filtered & sorted categories
  const displayedCategories = useMemo(() => {
    let filtered = categories;

    // Search filter (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((cat) =>
        cat.name.toLowerCase().includes(query)
      );
    }

    // Then sort
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
      default:
        break;
    }

    return sorted;
  }, [categories, searchQuery, sortBy]);

  // Clear search
  const clearSearch = () => setSearchQuery("");

  // Loading Skeleton (unchanged)
  if (loading) {
    return (
      <section className="py-16 px-5 sm:px-6 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Shop by Category
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
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

  // Error (unchanged)
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
      {/* Header + Controls (Search + Sort) */}
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

        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 md:gap-6">
          {/* Search Bar */}
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

          {/* Sort Dropdown */}
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

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        {displayedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 dark:text-gray-400"
          >
            <p className="text-xl">No categories found matching "{searchQuery}"</p>
            <button
              onClick={clearSearch}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 md:gap-7">
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
      </div>

      {/* Optional stats placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center"
      >
        {/* Add stats here if needed */}
      </motion.div>
    </section>
  );
}