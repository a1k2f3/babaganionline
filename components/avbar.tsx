// components/Navbar.tsx
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  FiLogIn,
} from "react-icons/fi";

import NavSearch from "./Searchbar";
import { Heart } from "lucide-react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItemCount] = useState(0); // ← can be made dynamic later
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Check login status (client-side)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token"); // ← change key if your token has different name
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Optional: listen for storage changes (multi-tab support)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

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
      {/* ==================== DESKTOP NAVBAR ==================== */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_35px_rgba(15,23,42,0.06)] fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-slate-800 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 shadow-lg shadow-indigo-200">
            <Image src="/logo2.jpg" alt="logo" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
            BabaGaniOnline
          </span>
        </Link>
        <div className="flex-1 max-w-xl mx-8">
          <NavSearch />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Home</Link>
          <Link href="/shop/orders" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Orders</Link>
          <Link href="/categories" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Categories</Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600">About</Link>
          <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Contact</Link>
          <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Support</Link>
        </div>

        <div className="flex items-center gap-5 pl-2">
          <Link href="/shop/cart" className="relative rounded-full p-2.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">
            <FiShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* ── Conditional Auth Button ── */}
          {isLoggedIn ? (
            <Link href="/profile" className="rounded-full p-2.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">
              <FiUser size={22} />
            </Link>
          ) : (
            <Link
              href="/auth/login" // ← adjust route if your login page is /signin, /auth/login, etc.
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500"
            >
              <FiLogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* ==================== MOBILE TOP HEADER ==================== */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_25px_rgba(15,23,42,0.05)] fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="z-10 rounded-full p-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm">
            <Image src="/logo2.jpg" alt="BabaGaniOnline" width={32} height={32} className="h-full w-full object-cover" />
          </div>
          <span className="text-base font-bold text-slate-800">BabaGani</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`rounded-full p-2 transition-all duration-200 ${
              isSearchOpen ? "bg-indigo-50 text-indigo-600 scale-105" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105"
            }`}
            aria-label="Search"
          >
            <FiSearch size={22} />
          </button>

          <Link href="/shop/cart" className="relative rounded-full p-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
            <FiShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search dropdown – unchanged */}
      {isSearchOpen && (
        <div className="fixed top-[60px] left-0 right-0 z-40 md:hidden bg-white shadow-lg border-b">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-600 p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
              >
                <FiX size={24} />
              </button>
              <div className="flex-1">
                <NavSearch />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MOBILE SIDEBAR ==================== */}
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

              {/* Optional: add Login / Profile in sidebar too */}
              <div className="pt-4 mt-4 border-t">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <FiUser size={22} />
                    <span className="font-medium">Profile</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-full hover:bg-indigo-50 text-indigo-600 font-medium transition"
                  >
                    <FiLogIn size={22} />
                    <span>Login / Sign up</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center py-3 border-t">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <FiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link href="/shop/orders" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <FiGrid size={24} />
          <span className="text-xs mt-1">Orders</span>
        </Link>

        {/* ── Conditional in bottom nav ── */}
        {isLoggedIn ? (
          <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
            <FiUser size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        ) : (
          <Link href="/auth/login" className="flex flex-col items-center   hover:bg-blue-600 transition">
            <FiLogIn size={24} />
            <span className="text-xs mt-1 ">Login</span>
          </Link>
        )}

        <Link href="/shop/cart" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition relative">
          <div className="relative">
            <FiShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link href="/profile/wishlist" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
          <Heart size={24} />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
      </nav>

      {/* Content padding for fixed elements */}
      <div className="h-[60px] md:h-[88px]" />
    </>
  );
};

export default Navbar;