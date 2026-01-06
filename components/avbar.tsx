// components/Navbar.js
"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiHome, FiGrid } from 'react-icons/fi'; // Assuming react-icons is installed
import Searchbar from './Searchbar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Implement search logic here, e.g., redirect to search page
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-4 ">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src="/logo2.jpg" alt="logo" width={50} height={50} className="inline-block ml-2"/>
          BabaGaniOnline
        </Link>
  <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-80"
          />
          <button type="submit" className="ml-2 text-gray-600">
            <FiSearch size={20} />
          </button>
        </form>
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/order" className="text-gray-600 hover:text-gray-900">Shop</Link>
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
        </div>

        {/* Search Bar */}
      

        {/* Icons: Cart and User */}
        <div className="flex space-x-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
            <FiShoppingCart size={24} />
            {/* Cart count badge - example */}
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </Link>
          <Link href="/account" className="text-gray-600 hover:text-gray-900">
            <FiUser size={24} />
          </Link>
        </div>
      </nav>

      {/* Mobile Top Bar (with Logo, Search, and Menu Toggle) */}
      <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          BAbaGaniOnline
        </Link>

        {/* Search Bar */}
        {/* <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-md px-2 py-1 mx-2 flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-full text-sm"
          />
          <button type="submit" className="ml-1 text-gray-600">
            <FiSearch size={16} />
          </button>
        </form> */}
        <Searchbar />

        {/* Menu Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Dropdown Menu (if needed, but since bottom nav handles main nav) */}
      {isMobileMenuOpen && (
        <div className="bg-white shadow-md fixed top-12 left-0 right-0 z-40 flex flex-col px-4 py-2 md:hidden">
          <Link href="/about" className="py-2 text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/contact" className="py-2 text-gray-600 hover:text-gray-900">Contact</Link>
        </div>
      )}

      {/* Mobile Bottom Navbar (excluding search and logo) */}
      <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiHome size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiGrid size={24} />
          <span className="text-xs">Shop</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative">
          <FiShoppingCart size={24} />
          <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          <span className="text-xs">Cart</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center text-gray-600 hover:text-gray-900">
          <FiUser size={24} />
          <span className="text-xs">Account</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;