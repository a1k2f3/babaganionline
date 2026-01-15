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
  productId: Product | null;
  storeId: Store | null;
  quantity: number;
  size: string;
  price: number;           // final price paid per unit
  discountPrice: number;  // discounted price per unit (if exists)
  _id: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
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
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");
    const token = localStorage.getItem("token");

    if (!token || !userID) {
      router.push("/auth/login");
      setError("Please log in to view your order history.");
      setLoading(false);
      return;
    }

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
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("UserId");
            router.push("/auth/login");
          } else {
            setError("Failed to fetch orders.");
          }
          setOrders([]);
          return;
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const cancelOrder = async (orderId: string) => {
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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        alert("Order cancelled successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to cancel order.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading your orders...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;

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
        {orders.map((order) => {
          const isCancellable = order.status === "Pending";

          const totalDiscount =
            typeof order.disCountamount === "number"
              ? order.disCountamount
              : order.items.reduce((sum, item) => {
                  const original = item.price;
                  const paid = item.discountPrice ?? item.price;
                  return sum + (original - paid) * item.quantity;
                }, 0);

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
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
                  </div>

                  <div className="text-right space-y-2">
                    <span
                      className={`inline-block px-6 py-3 rounded-full text-sm font-bold tracking-wide ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800"
                        : order.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped" ? "bg-blue-100 text-blue-800"
                        : order.status === "Cancelled" ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {order.status}
                    </span>

                    <div className="mt-4">
                      <p className="text-lg  font-medium text-red-900 line-through">
                        Total Amount:
                        RS{order.totalAmount.toLocaleString("en-IN")}
                      </p>

                      {totalDiscount > 0 && (
                        <p className="text-3xl font-extrabold text-green-700 mt-2">
                          Total Bill After Discount:{" "}
                          <span className="font-bold text-green-800">
                            RS{totalDiscount.toLocaleString("en-IN")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isCancellable && (
                <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 text-right">
                  <button
                    onClick={() => cancelOrder(order._id)}
                    disabled={cancellingId === order._id}
                    className={`px-8 py-3 rounded-lg font-medium transition-all ${
                      cancellingId === order._id
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}

              {/* Items */}
              <div className="p-8">
                {order.items.map((item) => {
                  const product = item.productId;
                  const hasImage = product && product.images?.length > 0;

                  const paidPrice = item.discountPrice ?? item.price;
                  const originalPrice = item.price;

                  const hasDiscount = item.discountPrice !== undefined && item.discountPrice < originalPrice;

                  const discountAmount = hasDiscount
                    ? (originalPrice - item.discountPrice!) * item.quantity
                    : 0;

                  const discountPercent = hasDiscount
                    ? Math.round(((originalPrice - item.discountPrice!) / originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-shrink-0">
                        {hasImage ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name || "Product"}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm text-center">
                              {product ? "No image" : "N/A"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {product?.name || "Product no longer available"}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          Store: <span className="font-bold text-indigo-600">
                            {item.storeId?.name || "Unknown Store"}
                          </span>
                        </p>

                        {item.size && (
                          <p className="text-sm text-gray-600 mt-1">
                            Size: <span className="font-medium">{item.size}</span>
                          </p>
                        )}

                        {/* ── PROMINENT PRICE DISPLAY ── */}
                        <div className="mt-4 space-y-3">
                          <div className="flex items-end gap-4 flex-wrap">
                            <span className="text-lg sm:text-4xl font-black text-red-600 tracking-tight line-through">
                              RS{paidPrice.toLocaleString("en-IN")}

                            </span>

                            {hasDiscount && (
                              <div className="flex items-center gap-4">
                                <span className="text-xl sm:text-2xl text-gray-400 line-through decoration-red-500 decoration-2 font-medium">
                                  RS{item.discountPrice.toLocaleString("en-IN")}
                                </span>

                                <span className="text-base font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-1.5 rounded-lg shadow-md">
                                  {discountPercent}% OFF
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Quantity:</span>
                            <span className="font-bold">{item.quantity}</span>
                            <span>×</span>
                          </div>

                          {hasDiscount && discountAmount > 0 && (
                            <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-1">
                              <p className="text-base font-semibold text-green-700">
                                Saved <span className="font-greens text-green-800">RS{discountAmount.toLocaleString("en-IN")}</span>
                              </p>
                            </div>
                          )}

                          {/* Item total */}
                          <div className="pt-4 mt-3 border-t border-gray-200">
                            <div className="flex justify-between items-baseline max-w-md">
                              <span className="text-base font-medium text-gray-700">Item Total:</span>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-red-900 line-through">
                                  RS{(paidPrice * item.quantity).toLocaleString("en-IN")}
                                </p>
                                {hasDiscount && (
                                  <p className="text-sm text-gray-500 line-through decoration-gray-400 line-through">
                                    RS{(paidPrice * item.quantity).toLocaleString("en-IN")}
                                  </p>
                                )}
                                {totalDiscount > 0 && (
                        <p className="text-3xl font-extrabold text-green-700 mt-2">
                          Total Bill After Discount:{" "}
                          <span className="font-bold text-green-800">
                            RS{totalDiscount.toLocaleString("en-IN")}
                          </span>
                        </p>
                      )}
                      
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right self-end min-w-[140px] hidden sm:block">
                        <p className="text-2xl font-bold text-gray-900">
                          RS{(paidPrice * item.quantity).toLocaleString("en-IN")}
                        </p>
                        {hasDiscount && (
                          <p className="text-sm text-gray-500 line-through">
                            RS{(originalPrice * item.quantity).toLocaleString("en-IN")}
                          </p>
                        )}
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
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                    <p className="text-gray-600 mt-2">
                      {order.shippingAddress.address},<br />
                      {order.shippingAddress.city} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-gray-700 mb-3 text-lg">Payment Details</p>
                    <p className="text-gray-800 capitalize">{order.paymentMethod}</p>
                    <p className="mt-2">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          order.paymentStatus === "Paid" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}