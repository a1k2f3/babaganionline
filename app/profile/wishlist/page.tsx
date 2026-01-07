// app/wishlist/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

// Minimal product interface for localStorage
interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string; // URL of the image
  // You can add more fields if you store them
}

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from localStorage when component mounts
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistItems: string[] = JSON.parse(savedWishlist);
        // For this example we assume you only store product IDs
        // In a real app you would probably store more data or fetch details
        // Here we just show a placeholder for each ID
        const wishlistProducts = wishlistItems.map((id) => ({
          _id: id,
          name: `Product ${id.slice(-6)}`, // placeholder name
          price: 0, // placeholder
          thumbnail: "/placeholder.jpg", // placeholder image
        }));
        setProducts(wishlistProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load wishlist from localStorage:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item from localStorage wishlist
  const removeFromWishlist = (productId: string) => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (!saved) return;

      const wishlistIds: string[] = JSON.parse(saved);
      const updated = wishlistIds.filter((id) => id !== productId);

      localStorage.setItem("wishlist", JSON.stringify(updated));

      // Update UI
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
  };

  // Placeholder for add to cart
  const addToCart = (productId: string) => {
    alert(`Add to cart functionality for product ${productId} can be implemented here.`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="bg-gray-200 aspect-square rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" strokeWidth={1.5} />
        <p className="text-xl text-gray-600 mb-8">Your wishlist is empty</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        My Wishlist ({products.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <Link href={`/product/${product._id}`}>
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            </Link>

            <div className="p-3 sm:p-4">
              <Link href={`/product/${product._id}`}>
                <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-green-600">
                    RS {product.price.toLocaleString()}
                  </span>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      RS {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}