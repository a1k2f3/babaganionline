// app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Tag, Truck, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      router.push("/auth/login?redirect=/cart");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart?userId=${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();

      const cartItems: CartItem[] = data.items?.map((item: any) => ({
        id: item.productId._id.toString(),
        name: item.productId.name,
        price: item.productId.price,
        size: item.size,
        quantity: item.quantity,
        image: item.productId.thumbnail || "/placeholder-product.jpg",
        inStock: item.productId.inStock ?? true,
      })) || [];

      setItems(cartItems);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, change: number) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update?userId=${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id, quantity: newQty }),
        }
      );

      if (!res.ok) throw new Error("Failed to update quantity");
    } catch (err) {
      console.error(err);
      // Rollback on error
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: item.quantity } : i))
      );
    }
  };

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    // Optimistic remove
    const prevItems = [...items];
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove/${id}?userId=${userID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to remove item");
    } catch (err) {
      console.error(err);
      setItems(prevItems); // rollback
      setError("Failed to remove item");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon === "SAVE10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/auth/login"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Login to view cart
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet. Start shopping now!
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-medium text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-indigo-600 transition p-2 -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items - takes most space */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                {/* Image */}
                <div className="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-3 py-1 bg-red-600/80 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-medium text-base sm:text-lg text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>

                  {item.size && (
                    <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                  )}

                  <div className="mt-auto pt-3 sm:pt-4">
                    <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                      Rs{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex items-center gap-4 mt-3 sm:mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 transition"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">
                    Rs{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount (SAVE10)</span>
                    <span>-Rs{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 sm:pt-4 border-t text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600 text-xl sm:text-2xl">
                    Rs{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              
              {/* Action */}
              <Link href="/shop/checkout" className="block mt-6">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 sm:py-5 rounded-xl transition shadow-md hover:shadow-xl text-base sm:text-lg">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-gray-600">
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