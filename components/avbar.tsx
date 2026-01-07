// components/Navbar.tsx
"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHome,
  FiGrid,
  FiMenu,
  FiX,
  FiPackage,
  FiHelpCircle,
  FiPhone,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";

import NavSearch from "./Searchbar";
import { Heart } from "lucide-react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const sidebarLinks = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/shop/orders", label: "Orders", icon: FiGrid },
    { href: "/categories", label: "Categories", icon: FiPackage },
    { href: "/about", label: "About Us", icon: FiInfo },
    { href: "/contact", label: "Contact", icon: FiPhone },
    { href: "/support", label: "Support", icon: FiHelpCircle },
  ];

  return (
    <>
      {/* ==================== DESKTOP NAVBAR - 100% UNCHANGED ==================== */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Image src="/logo2.jpg" alt="logo" width={50} height={50} />
          BabaGaniOnline
        </Link>
        <div className="flex-1 max-w-xl mx-8">
          <NavSearch />
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/shop/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
        </div>

        <div className="flex space-x-4">
          <Link href="/shop/cart" className="text-gray-600 hover:text-gray-900 relative">
            <FiShoppingCart size={24} />
           
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            <FiUser size={24} />
          </Link>
        </div>
      </nav>

      {/* ==================== MOBILE TOP HEADER - CLEAN & BALANCED ==================== */}
      <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3">
        {/* LEFT: Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-700 hover:text-indigo-600 transition z-10"
          aria-label="Open menu"
        >
          <FiMenu size={28} />
        </button>

        {/* CENTER: Logo + Name */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Image src="/logo2.jpg" alt="BabaGaniOnline" width={40} height={40} className="rounded-lg" />
          <span className="text-lg font-bold text-gray-800">BabaGani</span>
        </Link>

        {/* RIGHT: Search, Cart, Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-gray-700 hover:text-indigo-600 transition"
            aria-label="Search"
          >
            <FiSearch size={24} />
          </button>

         

          
        </div>
      </div>

      {/* ==================== MOBILE SIDEBAR DRAWER (LEFT SIDE) ==================== */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button onClick={() => setIsSidebarOpen(false)}>
                <FiX size={26} className="text-gray-600" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={22} className="text-gray-600 group-hover:text-indigo-600" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <FiChevronRight className="text-gray-400 group-hover:text-indigo-600" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* ==================== MOBILE FULL-SCREEN SEARCH OVERLAY ==================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center px-4 py-4 border-b shadow-sm">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-600 mr-4"
            >
              <FiX size={26} />
            </button>

            <div className="flex-1 relative">
              <NavSearch  />

              {/* Search Suggestions Dropdown */}
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-x border-b rounded-b-2xl overflow-hidden z-10">
                <div className="py-2 max-h-96 overflow-y-auto">
                  {["T-Shirts", "Kurtas", "Jeans", "Shoes", "Watches", "Bags"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearchSubmit(suggestion)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-4 text-gray-700"
                    >
                      <FiSearch size={18} className="text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <p className="text-center text-gray-500 mt-20">
              Type or select a suggestion to search
            </p>
          </div>
        </div>
      )}

      {/* ==================== MOBILE BOTTOM NAVBAR ==================== */}
      <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center py-3 border-t">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <FiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link href="/shop/orders" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <FiGrid size={24} />
          <span className="text-xs mt-1">Shop</span>
        </Link>

        

        <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <FiUser size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        <Link href="/shop/cart" className="relative text-gray-700 hover:text-indigo-600 transition">
            <FiShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
              <span className="text-xs mt-1">Cart</span>
          </Link>
<Link href="/profile/wishlist" className="relative text-gray-700 hover:text-indigo-600 transition">
            <Heart/>
              <span className="text-xs mt-1">Wishlist</span>
          </Link>
      </nav>

      {/* Content padding */}
      <div className="pt-0 md:pt-24 pb-10 md:pb-0" />
    </>
  );
};

export default Navbar;