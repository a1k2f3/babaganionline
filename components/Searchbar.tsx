"use client";

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Redirect to search results page (common pattern)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      
      // Or if using Next.js navigation:
      // router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center border border-gray-300 rounded-md px-3 py-2 flex-1 max-w-md focus-within:border-blue-500 transition-colors"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none w-full text-sm bg-transparent"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="ml-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Submit search"
      >
        <FiSearch size={18} />
      </button>
    </form>
  );
}