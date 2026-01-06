// app/order-success/page.tsx   (or pages/order-success.tsx if using pages directory)

"use client";


import React, { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight, Home, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  // Optional: Clear cart from localStorage after successful order
  useEffect(() => {
    localStorage.removeItem("cart"); // if you store cart locally
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 mt-20 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
            <div className="relative bg-green-600 rounded-full p-6">
              <CheckCircle className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for shopping with us. Your order has been confirmed and is being processed.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 text-left max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Confirmation</p>
                <p className="text-gray-600">You’ll receive an email with order details shortly.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Fast Delivery</p>
                <p className="text-gray-600">Your package is on its way. Track it anytime.</p>
              </div>
            </div>
          </div>

          {/* Fake Order ID (you can pass real one via state if needed) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-mono font-bold text-indigo-600">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>

          <Link
            href="/shop/orders"
            className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-xl text-lg transition shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Footer Message */}
        <p className="mt-12 text-gray-500 text-sm">
          Questions? Contact us at{" "}
          <a href="mailto:support@yoursite.com" className="text-indigo-600 hover:underline">
            support@yoursite.com
          </a>
        </p>
      </div>
    </div>
  );
}