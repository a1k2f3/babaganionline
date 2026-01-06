// app/cart/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const revalidate = 60;

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, Tag, Truck, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
// useRouter
// Define CartItem interface for type safety
interface CartItem {
  id: string;
  name: string;
  price: number;
  size?:string;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // Not used, but keeping for potential future use
const router=useRouter()
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, ""); // Token from login
    console.log("Using token:", token);
    console.log("Using UserID:", userID);

    if (!token || !userID) {
      router.push('/auth/login')
      setError("Please login to view your cart");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart?userId=${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token here
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setSuccess(true);
      console.log(data);

      // Assuming backend returns { cart: { items: [{ productId: { _id, name, price, image, inStock }, quantity }] } }
      // Map to frontend CartItem format
      const populatedItems: CartItem[] = data.items.map((item: any) => ({
        id: item.productId._id.toString(),
        size:item.size,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.thumbnail || "/api/placeholder/400/400",
        inStock: item.productId.inStock ?? true,
      }));
      console.log()

      setItems(populatedItems);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []); // Fixed dependency array

  const updateQuantity = async (id: string, change: number) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      setError("Please login to update cart");
      return;
    }

    // Find the item and calculate new quantity
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    // Optimistic update: Update local state first for smooth UX
    const prevItems = [...items];
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update?userId=${userID}`,
        {
          method: "PUT", // Assuming POST for update
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: id,
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      const data = await response.json();
  
    
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      // Rollback optimistic update on failure
      setItems(prevItems);
    }
  };

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");

    if (!token || !userID) {
      setError("Please login to update cart");
      return;
    }

    // Optimistic update: Remove from local state first
    const prevItems = [...items];
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove/${id}?userId=${userID}`, // Assuming a remove endpoint
        {
          method: "DELETE", // Or DELETE, depending on your backend
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove cart item");
      }

      const data = await response.json();
    
      // Optionally, refetch cart
      // await fetchCart();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      // Rollback on failure
      setItems(prevItems);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <p className="text-xl text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <Link href="/login" className="mt-4 block text-indigo-600 hover:text-indigo-700 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
          <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    RS{item.price.toLocaleString("en-IN")}
                  </p>
                  {item.size && (
                    <p className="text-gray-600 mt-1">Size: {item.size}</p>
                  )}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={item.quantity === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount {coupon === "SAVE10" ? "(SAVE10)" : ""}</span>
                  <span>-RS{discount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-4">
                  <span>Total</span>
                  <span className="text-2xl text-indigo-600">RS{total.toLocaleString("en-IN")}</span>
                </div>

                {/* Coupon */}
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Apply
                    </button>
                  </div>
                  {coupon === "SAVE10" && (
                    <p className="text-green-600 text-sm mt-2">10% discount applied!</p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 py-6 border-t mt-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>100% Secure</span>
                  </div>
                </div>

                <Link href="/shop/checkout">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
                    Proceed to Checkout
                  </button>
                </Link>

                <Link href="/" className="block text-center text-indigo-600 hover:text-indigo-700 font-medium mt-4">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}