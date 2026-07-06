"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  images: { url: string }[];
  price?: number;
  discountPrice?: number;
}

interface Store {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  contactNumber?: string;
}

interface OrderItem {
  productId?: Product | null;
  storeId?: Store | null;
  quantity: number;
  size?: string;
  price: number;
  discountPrice?: number;
  _id: string;
  // Guest order fields
  title?: string;
  image?: string;
}

interface ShippingAddress {
  name: string;
  phone?: string;
  address: string;
  city: string;
  pincode: string;
  country?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  disCountamount?: number;
  discountAmount?: number; // Guest uses this
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
  trackingToken?: string;
}

interface GuestOrderResponse {
  success: boolean;
  order: Order & {
    guestInfo: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [guestOrder, setGuestOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");
    const token = localStorage.getItem("token");

    if (!token || !userID) {
      setIsGuestMode(true);
      setLoading(false);
      return;
    }

    // Logged-in user flow
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders?userId=${userID}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("UserId");
            router.push("/auth/login");
          }
          setError("Failed to fetch orders.");
          return;
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const fetchGuestOrder = async (id: string) => {
    setGuestLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/guest-orders/track/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid tracking ID");
      }

      const data: GuestOrderResponse = await response.json();

      if (data.success && data.order) {
        setGuestOrder(data.order);
      } else {
        setError("Order not found. Please check your tracking ID.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch guest order.");
    } finally {
      setGuestLoading(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    fetchGuestOrder(trackingId.trim());
  };

  const cancelOrder = async (orderId: string) => {
    // ... (keep your existing cancel logic)
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/cancel/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        alert("Order cancelled successfully!");
      } else {
        alert("Failed to cancel order.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setCancellingId(null);
    }
  };

  // Loading & Error States
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading your orders...</div>;
  }

  if (error && !isGuestMode) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  // Guest Mode UI
  if (isGuestMode && !guestOrder) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Track Your Order</h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your tracking ID sent via email/SMS
          </p>

          <form onSubmit={handleGuestSubmit} className="space-y-6">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. bc3be004d422dbce168d6a80f98f6157"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            <button
              type="submit"
              disabled={guestLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition"
            >
              {guestLoading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  // Display Guest Order
  if (guestOrder) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4 py-8">
        <button
          onClick={() => {
            setGuestOrder(null);
            setTrackingId("");
          }}
          className="mb-6 text-indigo-600 hover:underline flex items-center gap-2"
        >
          ← Back to Tracking
        </button>

        <OrderCard order={guestOrder} isGuest={true} cancellingId={cancellingId} onCancel={cancelOrder} />
      </div>
    );
  }

  // Regular Logged-in Orders
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Order History</h2>
        <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 py-8 mb-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">My Order History</h2>

      <div className="space-y-12">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isGuest={false}
            cancellingId={cancellingId}
            onCancel={cancelOrder}
          />
        ))}
      </div>
    </div>
  );
}

// Reusable Order Card Component
function OrderCard({
  order,
  isGuest,
  cancellingId,
  onCancel,
}: {
  order: Order;
  isGuest: boolean;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}) {
  const isCancellable = order.status === "Pending";

  const totalDiscount = order.discountAmount ?? order.disCountamount ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono font-bold text-gray-900">{order._id}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Placed on: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
            {isGuest && order.trackingToken && (
              <p className="text-sm text-gray-600 mt-1">Tracking ID: {order.trackingToken}</p>
            )}
          </div>

          <div className="text-right space-y-2">
            <span className={`inline-block px-6 py-3 rounded-full text-sm font-bold ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>

            <div className="mt-4">
              <p className="text-lg font-medium text-red-900 line-through">
                Total: RS{order.totalAmount.toLocaleString("en-IN")}
              </p>
              {totalDiscount > 0 && (
                <p className="text-3xl font-extrabold text-green-700 mt-2">
                  After Discount: RS{(order.totalAmount - totalDiscount).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCancellable && !isGuest && (
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 text-right">
          <button
            onClick={() => onCancel(order._id)}
            disabled={cancellingId === order._id}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              cancellingId === order._id
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      )}

      {/* Items */}
      <div className="p-8">
        {order.items.map((item) => {
          const paidPrice = item.discountPrice ?? item.price;
          const originalPrice = item.price;
          const hasDiscount = !!item.discountPrice && item.discountPrice < originalPrice;
          const discountPercent = hasDiscount
            ? Math.round(((originalPrice - item.discountPrice!) / originalPrice) * 100)
            : 0;

          return (
            <div key={item._id} className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0">
                <Image
                  src={item.image || (item.productId?.images?.[0]?.url || "")}
                  alt={item.title || item.productId?.name || "Product"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover border border-gray-200"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title || item.productId?.name || "Product"}
                </h3>

                {item.storeId?.name && (
                  <p className="text-sm text-gray-600 mt-1">
                    Store: <span className="font-bold text-indigo-600">{item.storeId.name}</span>
                  </p>
                )}

                {item.size && (
                  <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                )}

                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-red-600">RS{paidPrice.toLocaleString("en-IN")}</span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-400 line-through">RS{originalPrice}</span>
                        <span className="bg-red-600 text-white text-sm px-3 py-1 rounded font-bold">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    Quantity: <span className="font-bold">{item.quantity}</span>
                  </p>
                </div>
              </div>

              <div className="text-right self-end min-w-[140px]">
                <p className="text-2xl font-bold text-gray-900">
                  RS{(paidPrice * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-bold text-gray-700 mb-3 text-lg">Delivery Address</p>
            <p className="text-gray-600">{order.shippingAddress.name}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-600 mt-2">
              {order.shippingAddress.address},<br />
              {order.shippingAddress.city} - {order.shippingAddress.pincode}
              {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="font-bold text-gray-700 mb-3 text-lg">Payment Details</p>
            <p className="text-gray-800 capitalize">{order.paymentMethod}</p>
            <p className="mt-2">
              Status:{" "}
              <span className={`font-bold ${order.paymentStatus === "Paid" ? "text-green-600" : "text-orange-600"}`}>
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "Shipped": return "bg-blue-100 text-blue-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-purple-100 text-purple-800";
  }
};