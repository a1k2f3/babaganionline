// app/shop/checkout/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Truck,
  CreditCard,
  CheckCircle,
  X,
  Wallet,
  Loader2,
} from "lucide-react";

type Step = "address" | "payment" | "review";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
  inStock: boolean;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  type: "home" | "work" | "other";
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | null>(null);
  const [paymentMethod] = useState<"cod">("cod"); // Only COD for now
  const [coupon] = useState(""); // You can make this dynamic later

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Address Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    type: "home" as "home" | "work" | "other",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    isDefault: false,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getAuth = () => {
    if (typeof window === "undefined") return { token: null, userId: null };
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("UserId")?.replace(/"/g, "");
    return { token, userId };
  };

  // Fetch Cart
  const fetchCart = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) {
      router.push("/auth/login?redirect=/shop/checkout");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();
      const cartItems: CartItem[] = (data.items || []).map((item: any) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        size: item.size,
        image: item.productId.thumbnail || "/placeholder.jpg",
        inStock: item.productId.inStock ?? true,
      }));

      setItems(cartItems);
    } catch (err) {
      setError("Could not load your cart. Please try again.");
    }
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/addresses/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Silently fallback to empty list on error
        setAddresses([]);
        return;
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.addresses || [];

      const formatted: Address[] = list.map((a: any) => ({
        id: a._id || a.id,
        name: a.name || "Unknown",
        phone: a.phone || "",
        type: a.type || "home",
        street: a.street || "",
        apartment: a.apartment || "",
        city: a.city || "",
        state: a.state || "",
        postalCode: a.postalCode || "",
        country: a.country || "Pakistan",
        isDefault: !!a.isDefault,
      }));

      setAddresses(formatted);

      // Auto-select default or first
      const defaultIdx = formatted.findIndex((a) => a.isDefault);
      setSelectedAddressIdx(defaultIdx !== -1 ? defaultIdx : formatted.length > 0 ? 0 : null);
    } catch (err) {
      console.error("Address fetch error:", err);
      setAddresses([]);
    }
  };

  // Add New Address
  const addAddress = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    const required = ["name", "phone", "street", "city", "state", "postalCode"];
    if (required.some((field) => !newAddress[field as keyof typeof newAddress])) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/users/addresses/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newAddress.name,
          phone: newAddress.phone,
          type: newAddress.type,
          street: newAddress.street,
          apartment: newAddress.apartment || undefined,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.postalCode,
          country: newAddress.country,
          isDefault: newAddress.isDefault,
        }),
      });

      if (!res.ok) throw new Error("Failed to save address");

      await fetchAddresses();
      setShowAddModal(false);
      setNewAddress({
        name: "", phone: "", type: "home", street: "", apartment: "", city: "", state: "", postalCode: "", country: "Pakistan", isDefault: false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to add address");
    } finally {
      setSubmitting(false);
    }
  };

  // Place Order
  const placeOrder = async () => {
    if (selectedAddressIdx === null) {
      setError("Please select a delivery address");
      return;
    }

    const address = addresses[selectedAddressIdx];
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            name: address.name,
            phone: address.phone,
            address: [address.street, address.apartment].filter(Boolean).join(", "),
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
          paymentMethod: "Cash on Delivery",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Order failed");
      }

      router.push("/shop/order-success");
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCart(), fetchAddresses()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + delivery;

  const steps = [
    { id: "address" as Step, label: "Delivery", icon: Truck },
    { id: "payment" as Step, label: "Payment", icon: Wallet },
    { id: "review" as Step, label: "Review", icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Checkout</h1>

        {/* Step Progress */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-6 lg:gap-12">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = step === s.id;
              const completed = ["address", "payment", "review"].indexOf(step) > i;
              return (
                <div key={s.id} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${completed || active ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"}`}>
                    {completed ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`ml-3 font-medium ${active ? "text-indigo-600" : "text-gray-600"} whitespace-nowrap`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <div className={`w-20 lg:w-32 h-1 mx-4 ${completed ? "bg-indigo-600" : "bg-gray-300"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Step */}
            {step === "address" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No addresses found. Please add one.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr, idx) => (
                      <label
                        key={addr.id}
                        className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressIdx === idx ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-400"}`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressIdx === idx}
                            onChange={() => setSelectedAddressIdx(idx)}
                            className="mt-1 w-5 h-5 text-indigo-600"
                          />
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">{addr.name}</span>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">{addr.type}</span>
                              {addr.isDefault && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Default</span>}
                            </div>
                            <p className="text-gray-700 mt-2">
                              {addr.street}{addr.apartment && `, ${addr.apartment}`}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-gray-600">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-6 border-2 border-dashed border-indigo-400 text-indigo-600 py-6 rounded-xl font-semibold hover:bg-indigo-50 transition"
                >
                  + Add New Address
                </button>

                <button
                  onClick={() => setStep("payment")}
                  disabled={selectedAddressIdx === null}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-5 rounded-xl transition shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input type="radio" checked readOnly className="w-6 h-6 text-green-600" />
                    <Wallet className="w-10 h-10 text-green-600" />
                    <div>
                      <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                      <p className="text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep("address")} className="flex-1 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl font-bold">
                    Back
                  </button>
                  <button onClick={() => setStep("review")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Review & Place Order</h2>

                {selectedAddressIdx !== null && (
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h3 className="font-bold mb-2">Delivery To</h3>
                    <p className="font-medium">{addresses[selectedAddressIdx].name}</p>
                    <p className="text-gray-600">
                      {addresses[selectedAddressIdx].street}{addresses[selectedAddressIdx].apartment && `, ${addresses[selectedAddressIdx].apartment}`}, {addresses[selectedAddressIdx].city} - {addresses[selectedAddressIdx].postalCode}
                    </p>
                    <p className="text-gray-600">Phone: {addresses[selectedAddressIdx].phone}</p>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold mb-2">Payment</h3>
                  <p className="font-medium flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-green-600" /> Cash on Delivery
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep("payment")} className="flex-1 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl font-bold">
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold py-5 rounded-xl text-xl shadow-lg flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{item.name}</h4>
                      {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-indigo-600 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-green-600 font-bold" : ""}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-indigo-600 text-2xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" /> Fast & Reliable Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Address</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "phone", "street", "city", "state", "postalCode"].map((field) => (
                <input
                  key={field}
                  type={field === "phone" ? "tel" : "text"}
                  placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${["name", "phone", "street", "city", "state", "postalCode"].includes(field) ? "*" : ""}`}
                  value={newAddress[field as keyof typeof newAddress] as string}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                  required={["name", "phone", "street", "city", "state", "postalCode"].includes(field)}
                />
              ))}
              <input
                type="text"
                placeholder="Apartment / Flat (optional)"
                value={newAddress.apartment}
                onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500 md:col-span-2"
              />
              <select
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span>Set as default address</span>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={addAddress}
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}