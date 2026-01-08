// app/wishlist/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  slug?: string;
  images?: { url: string }[];
}

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const UserId = typeof window !== "undefined" ? localStorage.getItem("UserId")?.replace(/"/g, "") : null;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  // Fetch wishlist - EXACTLY MATCHING YOUR CURRENT API RESPONSE
  const fetchWishlist = async () => {
    if (!token || !UserId) {
      setError("Please log in to view your wishlist");
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/wishlist/${UserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("UserId");
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to load wishlist");
      }

      const response = await res.json();

      // Your API structure: { success: true, data: { products: [{ product: {...} }, ...] } }
      const wishlistItems = 
        response?.data?.products?.map((item: any) => item.product) || [];

      // Safety: ensure we only set valid products
      const validProducts = wishlistItems.filter(
        (item: any): item is WishlistProduct =>
          item &&
          typeof item === "object" &&
          item._id &&
          item.name &&
          typeof item.price === "number"
      );

      setProducts(validProducts);
    } catch (err: any) {
      console.error("Wishlist fetch error:", err);
      setError("Failed to load your wishlist. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!token || !UserId) {
      router.push("/auth/login");
      return;
    }

    setRemovingId(productId);

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/${UserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove item");
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      console.error("Remove error:", err);
      alert(err.message || "Failed to remove item from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = (productId: string) => {
    alert("Add to cart coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">My Wishlist</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-28 h-28 text-gray-300 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
          <p className="text-xl text-red-600 mb-10">{error}</p>
          <Link href="/auth/login" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-32 h-32 text-gray-300 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-6">Your Wishlist is Empty</h1>
          <p className="text-xl text-gray-600 mb-12">Save your favorite products to buy later!</p>
          <Link href="/" className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white text-lg rounded-2xl hover:bg-indigo-700">
            <ShoppingCart className="w-6 h-6" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 flex items-center gap-4 justify-center sm:justify-start">
          <Heart className="w-12 h-12 text-red-500 fill-current" />
          My Wishlist ({products.length})
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <Link href={`/product/${product.slug || product._id}`}>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={product.thumbnail || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.66vw"
                  />
                </div>
              </Link>

              <div className="p-5">
                <Link href={`/product/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-4 hover:text-indigo-600">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-5">
                  {product.discountPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        RS {product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        RS {product.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      RS {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    disabled={removingId === product._id}
                    className="p-3 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50"
                    title="Remove"
                  >
                    {removingId === product._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}