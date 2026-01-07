// app/wishlist/page.tsx  (or wherever your wishlist route is)
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  stock: number;
  addedAt?: string;
}

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Get user ID from localStorage (same as your other components)
  const userID = typeof window !== "undefined" 
    ? localStorage.getItem("UserId")?.replace(/"/g, "")
    : null;

  const token = typeof window !== "undefined" 
    ? localStorage.getItem("token")
    : null;

  // Fetch wishlist when component mounts or userID changes
  useEffect(() => {
    if (!userID) {
      setError("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist?id=${userID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to load wishlist");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err: any) {
        console.error("Wishlist fetch error:", err);
        setError(err.message || "Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userID, token]);

  // Optional: Remove item from wishlist (using DELETE /api/wishlist/:productId?id=...)
  const removeFromWishlist = async (productId: string) => {
    if (!userID) return;

    try {
      setRemovingId(productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/${productId}?id=${userID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove item");
      }

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      alert(err.message || "Could not remove item from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  // Add to cart placeholder (you can integrate your real addToCart later)
  const addToCart = (productId: string) => {
    alert(`Add to cart functionality for product ${productId} can be added here!`);
  };

  if (!userID) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-600">Please log in to view your wishlist.</p>
        <Link
          href="/auth/login"
          className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="bg-gray-200 aspect-square rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <p className="text-xl text-gray-600 mb-8">Your wishlist is empty</p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700"
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

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Link href={`/product/${product._id}`}>
              <div className="relative aspect-square">
                <Image
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/product/${product._id}`}>
                <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 hover:text-indigo-600">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-4">
                <div>
                  {product.discountPrice ? (
                    <>
                      <span className="text-xl font-bold text-green-600">
                        RS {product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        RS {product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-green-600">
                      RS {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  disabled={removingId === product._id}
                  className="px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
                >
                  {removingId === product._id ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}