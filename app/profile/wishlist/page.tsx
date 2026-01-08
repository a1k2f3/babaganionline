// app/wishlist/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Full product type from your backend
interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  slug?: string;
  // add more fields as needed
}

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
 const token = localStorage.getItem("token");
    const UserId = localStorage.getItem("UserId")?.replace(/"/g, "");
 

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

     
      if (!token) {
        setError("Please log in to view your wishlist");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/${UserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // if using httpOnly cookies
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          // Optional: redirect to login
          // router.push("/login");
        } else {
          throw new Error("Failed to load wishlist");
        }
        setProducts([]);
        return;
      }

      const data = await res.json();
      // Adjust based on your API response structure
      // Example: { success: true, wishlist: [{ product: { ... } }] }
      const wishlistItems = Array.isArray(data)
        ? data
        : data.wishlist?.map((item: any) => item.product) || data.products || [];

      setProducts(wishlistItems);
    } catch (err: any) {
      console.error("Wishlist fetch error:", err);
      setError(err.message || "Failed to load wishlist");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    try {
     
      if (!token) {
        alert("Please log in");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/${UserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          body: JSON.stringify({ productId }),  
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      // Update UI optimistically
      setProducts((prev) => prev.filter((p) => p._id !== productId));

      // Optional: show success toast
    } catch (err) {
      console.error("Remove wishlist error:", err);
      alert("Failed to remove item from wishlist");
    }
  };

  // Add to cart (you can expand this later)
 

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(6)].map((_, i) => (
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

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-xl text-red-600 mb-8">{error}</p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Empty state
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

  // Main wishlist view
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        My Wishlist ({products.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <Link href={`/product/${product.slug || product._id}`}>
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  priority={false}
                />
              </div>
            </Link>

            <div className="p-3 sm:p-4">
              <Link href={`/product/${product.slug || product._id}`}>
                <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-3">
                <div>
                 
                      <span className="text-lg font-bold text-green-600">
                      
                      
                        RS {product.price.toLocaleString()}
                      
                   </span>
                  
                </div>
              </div>

              <div className="flex gap-2">
               

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