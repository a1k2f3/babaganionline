// components/card/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Copy,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function ProductActions({
  product,
  formId,
  initialWishlisted = false,
}: {
  product: any;
  formId?: string;
  initialWishlisted?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false); // Controlled locally
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const router = useRouter();

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out "${product.name}" for just ${product.discountPrice || product.price} RS!`;

  // ========== LOCAL WISHLIST LOGIC (localStorage) ==========
  useEffect(() => {
    // Load wishlist from localStorage on mount
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        setWishlisted(wishlistIds.includes(product._id));
      } else {
        setWishlisted(initialWishlisted);
      }
    } catch (err) {
      setWishlisted(initialWishlisted);
    }
  }, [product._id, initialWishlisted]);

  const toggleWishlistLocal = () => {
    try {
      let wishlistIds: string[] = [];
      const saved = localStorage.getItem("wishlist");

      if (saved) {
        wishlistIds = JSON.parse(saved);
      }

      if (wishlistIds.includes(product._id)) {
        // Remove
        wishlistIds = wishlistIds.filter((id) => id !== product._id);
        setWishlisted(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        // Add
        wishlistIds.push(product._id);
        setWishlisted(true);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
    } catch (err) {
      setError("Failed to update wishlist locally");
    }
  };

  // ========== ADD TO CART (unchanged) ==========
  const getSelectedSize = (): string | null => {
    if (!formId) return null;
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return null;
    const formData = new FormData(form);
    return (formData.get("selectedSize") as string) || null;
  };

  const handleAddToCart = async (buyNow = false) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const hasSizes = Array.isArray(product.size) && product.size.length > 0;
    const selectedSize = getSelectedSize();

    if (hasSizes && !selectedSize) {
      setError("Please select a size before adding to cart");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      router.push("/auth/login?redirect=" + encodeURIComponent(currentUrl));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add?userId=${userID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            quantity,
            storeId: product.brand?._id || "",
            size: selectedSize || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);

      if (buyNow) {
        router.push("/cart");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========== SHARE FUNCTIONALITY ==========
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: currentUrl,
        });
        return;
      } catch (err) {
        console.log("Native share failed");
      }
    }
    setShareOpen(!shareOpen);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copied!");
    } catch {
      alert("Failed to copy");
    }
    setShareOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={loading}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            -
          </button>
          <span className="px-6 py-2 font-semibold text-lg min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={loading}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleAddToCart(false)}
          disabled={loading}
          className="flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={() => handleAddToCart(true)}
          disabled={loading}
          className="py-4 px-6 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Buy Now
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-5 py-3 rounded-lg font-medium">
          <CheckCircle className="w-5 h-5" />
          {wishlisted ? "Added to wishlist!" : "Removed from wishlist"}
        </div>
      )}

      {error && (
        <div className="text-red-700 bg-red-50 px-5 py-3 rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Wishlist & Share */}
      <div className="flex gap-4">
        <button
          onClick={toggleWishlistLocal}
          className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 font-medium transition-all ${
            wishlisted
              ? "bg-red-50 border-red-500 text-red-600"
              : "border-gray-300 hover:border-red-400 text-gray-700 hover:bg-red-50"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>

        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>

          {shareOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShareOpen(false)} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-20">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + currentUrl)}`)}
                  className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">WA</div>
                  WhatsApp
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`)}
                  className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">f</div>
                  Facebook
                </button>
                <button onClick={copyLink} className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-3">
                  <Copy className="w-5 h-5 text-gray-600" />
                  Copy Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}