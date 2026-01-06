// components/navbar/NavSearch.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Suggestion {
  _id: string;
  name: string;
  thumbnail: string;
}

const NavSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions instantly on every query change
  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmedQuery = query.trim();

      if (trimmedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        setHighlightedIndex(-1);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search/suggestions?q=${encodeURIComponent(trimmedQuery)}`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (data.success && Array.isArray(data.suggestions)) {
          const limited = data.suggestions.slice(0, 8); // Max 8 for performance
          setSuggestions(limited);
          setShowSuggestions(limited.length > 0);
          setHighlightedIndex(-1); // Reset highlight on new results
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]); // ← Triggers on every keystroke — no debounce!

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSuggestionClick(suggestions[highlightedIndex].name);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      resetSearch();
    }
  };

  const handleSuggestionClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name)}`);
    resetSearch();
  };

  const resetSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (query.trim().length >= 2 && (suggestions.length > 0 || loading)) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, brands, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-5 py-3.5 pr-12 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg focus:shadow-xl focus:outline-none focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
          autoComplete="off"
          aria-label="Search products"
        />

        {/* Search Button / Spinner */}
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-colors"
          aria-label="Search"
        >
          {loading ? (
            <FaSpinner className="w-5 h-5 animate-spin" />
          ) : (
            <FaSearch className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && query.trim().length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-3 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
        >
          <ul className="max-h-96 overflow-y-auto py-2">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li key={suggestion._id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-5 py-4 flex items-center gap-4 transition-all duration-200 text-left ${
                      highlightedIndex === index
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
                      <Image
                        src={suggestion.thumbnail || "/placeholder.jpg"}
                        alt={suggestion.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="font-medium text-gray-900 truncate flex-1">
                      {suggestion.name}
                    </p>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-5 py-8 text-center text-gray-500">
                No products found
              </li>
            )}
          </ul>

          {/* View All Results */}
          <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full text-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View all results for "{query.trim()}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavSearch;