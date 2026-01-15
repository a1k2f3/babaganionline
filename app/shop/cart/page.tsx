// app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Truck, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  size?: string;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
     const userId = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userId) {
      router.push("/auth/login?redirect=/cart");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        const userId = localStorage.getItem("UserId")?.replace(/"/g, "");
        router.push("/auth/login?redirect=/cart");
        return;
      }

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();

      const cartItems: CartItem[] = (data.items ?? []).map((item: any) => ({
        id: item.productId?._id?.toString() ?? "",
        name: item.productId?.name ?? "Unknown Product",
        price: Number(item.productId?.price) || 0,
        discountPrice: item.productId?.discountPrice
          ? Number(item.productId.discountPrice)
          : undefined,
        size: item.size,
        quantity: item.quantity ?? 1,
        image: item.productId?.thumbnail || "/placeholder-product.jpg",
        inStock: item.productId?.inStock ?? true,
      }));

      setItems(cartItems.filter((item) => item.id));
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, change: number) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("UserId")?.replace(/"/g, ""); 

    const item = items.find((i) => i.id === id);
    if (!item || !token || !userId) return;

    const newQty = Math.max(1, item.quantity + change);

    setActionLoading(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id, quantity: newQty }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
      alert("Failed to update quantity");
    } finally {
      setActionLoading(null);
    }
  };

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");
     const userId = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userId) return;

    const prevItems = [...items];
    setActionLoading(id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove/${id}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to remove");
    } catch {
      setItems(prevItems);
      alert("Failed to remove item");
    } finally {
      setActionLoading(null);
    }
  };

  // Price calculation (only product-level discounts)
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice && item.discountPrice < item.price
      ? item.discountPrice
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal;

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/auth/login"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700"
          >
            Login to view cart
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full grid place-items-center">
            <Trash2 className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link href="/" className="p-2 -ml-2 text-gray-600 hover:text-indigo-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Shopping Cart ({items.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {items.map((item) => {
              const hasDiscount =
                item.discountPrice !== undefined &&
                item.discountPrice > 0 &&
                item.discountPrice < item.price;

              // Safe price handling after condition check
              const displayPrice = hasDiscount ? item.discountPrice! : item.price;

              const discountPercent = hasDiscount
                ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
                : 0;

              const isActionLoading = actionLoading === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow transition p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 ${
                    !item.inStock ? "opacity-75" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/65 grid place-items-center">
                        <span className="text-white text-sm font-medium px-4 py-1.5 bg-red-600/90 rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>

                    {item.size && (
                      <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                    )}

                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-bold text-red-600">
                          Rs {displayPrice.toLocaleString("en-IN")}
                        </span>

                        {hasDiscount && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              Rs {item.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                              {discountPercent}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-5 mt-5">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40"
                            disabled={item.quantity <= 1 || isActionLoading}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-5 py-2 font-medium min-w-[3.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40"
                            disabled={isActionLoading}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                          disabled={isActionLoading}
                        >
                          <Trash2 size={18} />
                          {isActionLoading ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">
                    Rs {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between pt-5 border-t text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700 text-2xl">
                    Rs {total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Link href="/shop/checkout" className="block mt-8">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-md hover:shadow-xl text-lg">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}