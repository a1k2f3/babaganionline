"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on every query change (no debounce)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search/suggestions?q=${encodeURIComponent(
            query.trim()
          )}`
        );
        const data = await res.json();

        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [query]); // Runs on every keystroke/change

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    router.push(`/search?q=${encodeURIComponent(name)}`);
    setQuery("");
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 || loading) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm transition-all"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
          autoComplete="off"
        />
        <button
          type="submit"
          className="text-gray-600 hover:text-blue-600 transition-colors ml-2"
          aria-label="Search"
        >
          <FaSearch size={18} />
        </button>
      </form>

      {/* Suggestions Dropdown - Shows instantly on change */}
      {(showSuggestions || loading) && query.trim().length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          {loading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading suggestions...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <ul className="max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li key={suggestion._id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      className="w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={suggestion.thumbnail}
                          alt={suggestion.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-gray-800 font-medium truncate">
                        {suggestion.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* View all results link */}
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="text-blue-600 font-medium text-sm hover:underline w-full text-left"
                >
                  View all results for "{query.trim()}"
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavSearch;