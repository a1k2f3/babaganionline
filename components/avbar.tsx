// components/Navbar.tsx (or .js)
"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiUser, FiHome, FiGrid } from 'react-icons/fi';

import NavSearch from './Searchbar'; // Assuming this is your full search input component

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Not used much now, but kept if you want extra links
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Image src="/logo2.jpg" alt="logo" width={50} height={50} />
          BabaGaniOnline
        </Link>

        {/* Search Bar (centered-ish) */}
        <div className="flex-1 max-w-xl mx-8">
          <NavSearch />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/shop/orders" className="text-gray-600 hover:text-gray-900">Shop</Link>
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
        </div>

        {/* Icons: Cart and User */}
        <div className="flex space-x-4">
          <Link href="/shop/cart" className="text-gray-600 hover:text-gray-900 relative">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <FiUser size={24} />
          </Link>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo2.jpg" alt="logo" width={40} height={40} />
          <span className="text-lg font-bold text-gray-800">BabaGaniOnline</span>
        </Link>

        {/* Right Icons: Search, Cart, Profile */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="text-gray-600">
            <FiSearch size={24} />
          </button>
          <Link href="/shop/cart" className="text-gray-600 relative">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </Link>
          <Link href="/profile" className="text-gray-600">
            <FiUser size={24} />
          </Link>
        </div>
      </div>

      {/* Full-screen Search Overlay (Mobile) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center px-4 py-3 border-b">
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-600 mr-3">
              {/* Back arrow - you can use FiArrowLeft if you import it */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <NavSearch  />
            </div>
          </div>
          {/* Optional: show search results below */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Your search results component can go here */}
            <p className="text-gray-500 text-center mt-10">Type to search...</p>
          </div>
        </div>
      )}

      {/* Optional Mobile Dropdown (if you still want extra links) */}
      {isMobileMenuOpen && (
        <div className="bg-white shadow-md fixed top-14 left-0 right-0 z-40 flex flex-col px-4 py-2 md:hidden">
          <Link href="/about" className="py-2 text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" className="py-2 text-gray-600 hover:text-gray-900">Contact</Link>
          {/* Add more if needed */}
        </div>
      )}

      {/* Mobile Bottom Navbar */}
      <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiHome size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/shop/orders" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiGrid size={24} />
          <span className="text-xs">Orders</span>
        </Link>
        <Link href="/shopcart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
          <FiShoppingCart size={24} />
          <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          <span className="text-xs">Cart</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiUser size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;