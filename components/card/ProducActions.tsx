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

interface ProductActionsProps {
  product: any;
  formId?: string;
  initialWishlisted?: boolean;
}

export default function ProductActions({
  product,
  formId,
  initialWishlisted = false,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const router = useRouter();

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out "${product.name}" for just ${product.discountPrice || product.price} RS!`;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Show message for limited time
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  // Fetch initial wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

      if (!token || !userID || !product?._id) return;

      try {
        const res = await fetch(`${API_BASE}/api/wishlist/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const isInWishlist = data.data?.products?.some(
            (item: any) => item.product?._id === product._id || item.product === product._id
          );
          setWishlisted(!!isInWishlist);
        }
      } catch (err) {
        console.error("Wishlist status fetch failed:", err);
      }
    };

    fetchWishlistStatus();
  }, [product._id]);

  // ── Shared Login Prompt Handler ──
  const handleRequireLogin = () => {
    // setMessage({ type: "error", text: "Please login to continue" });
    setShowLoginPrompt(true);
  };

  // ── Wishlist Toggle ──
  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      handleRequireLogin();
      return;
    }

    setWishlistLoading(true);
    setMessage(null);

    try {
      if (wishlisted) {
        // Remove
        const res = await fetch(`${API_BASE}/api/wishlist/${userID}/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        if (!res.ok) throw new Error("Failed to remove from wishlist");
        setWishlisted(false);
        setMessage({ type: "success", text: "Removed from wishlist" });
      } else {
        // Add
        const res = await fetch(`${API_BASE}/api/wishlist/${userID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (errData.message === "Product already in wishlist") {
            setWishlisted(true);
            setMessage({ type: "success", text: "Already in wishlist" });
            return;
          }
          throw new Error(errData.message || "Failed to add to wishlist");
        }

        setWishlisted(true);
        setMessage({ type: "success", text: "Added to wishlist!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setWishlistLoading(false);
    }
  };

  // ── Add to Cart ──
  const getSelectedSize = (): string | null => {
    if (!formId) return null;
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return null;
    const formData = new FormData(form);
    return (formData.get("selectedSize") as string) || null;
  };

  const handleAddToCart = async (buyNow = false) => {
    setCartLoading(true);
    setMessage(null);

    const hasSizes = Array.isArray(product.size) && product.size.length > 0;
    const selectedSize = getSelectedSize();

    if (hasSizes && !selectedSize) {
      setMessage({ type: "error", text: "Please select a size first" });
      setCartLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      handleRequireLogin();
      setCartLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/add?userId=${userID}`, {
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
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add to cart");
      }

      setMessage({ type: "success", text: "Added to cart successfully!" });

      if (buyNow) {
        router.push("/shop/cart");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to add to cart" });
    } finally {
      setCartLoading(false);
    }
  };

  // ── Share Handlers ──
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText, url: currentUrl });
        return;
      } catch {}
    }
    setShareOpen(!shareOpen);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setMessage({ type: "success", text: "Link copied to clipboard!" });
    } catch {
      setMessage({ type: "error", text: "Failed to copy link" });
    }
    setShareOpen(false);
  };

  const isLoading = cartLoading || wishlistLoading;

  return (
    <div className="space-y-6">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isLoading}
            className="px-5 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            −
          </button>
          <span className="px-8 py-2.5 font-semibold text-lg min-w-[72px] text-center border-x border-gray-300">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={isLoading}
            className="px-5 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleAddToCart(false)}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow transition-all"
        >
          {cartLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
          {cartLoading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={() => handleAddToCart(true)}
          disabled={isLoading}
          className="py-4 px-6 bg-black hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow transition-all"
        >
          Buy Now
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              !
            </div>
          )}
          {message.text}
        </div>
      )}

      {/* Login Prompt when needed */}
      {showLoginPrompt && !message && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-amber-800 font-medium">Login required to continue shopping</span>
          <button
            type="button"
            onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition whitespace-nowrap"
          >
            Login Now
          </button>
        </div>
      )}

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl border-2 font-medium transition-all ${
            wishlisted
              ? "bg-red-50 border-red-500 text-red-600"
              : "border-gray-300 hover:border-red-400 text-gray-700 hover:bg-red-50"
          } ${wishlistLoading ? "opacity-70 cursor-wait" : ""}`}
        >
          {wishlistLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
          )}
          {wishlistLoading
            ? "Updating..."
            : wishlisted
            ? "In Wishlist"
            : "Add to Wishlist"}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all w-full sm:w-auto"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>

          {shareOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShareOpen(false)}
              />
              <div className="absolute bottom-full sm:top-full left-1/2 sm:left-0 sm:right-auto -translate-x-1/2 sm:translate-x-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border z-20 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + currentUrl)}`
                    )
                  }
                  className="w-full text-left px-6 py-3.5 hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    WA
                  </div>
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
                    )
                  }
                  className="w-full text-left px-6 py-3.5 hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    f
                  </div>
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={copyLink}
                  className="w-full text-left px-6 py-3.5 hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                  Copy Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <a
  href="https://wa.me/923338456070"
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5c] active:bg-[#1ea754] w-full max-w-md mx-auto text-white text-xl font-semibold rounded-2xl shadow-lg shadow-green-600/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-400/50"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-7 h-7" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.572-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.48 0 1.463 1.065 2.877 1.213 3.077.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2.04c-5.523 0-10 4.477-10 10 0 1.89.524 3.65 1.43 5.15L2 22l4.89-1.28C8.35 21.48 10.12 22 12 22c5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
  </svg>
  Chat on WhatsApp
</a>
    </div>
  );
}