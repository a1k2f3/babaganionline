// app/profile/edit/page.tsx
"use client";



import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

interface Address {
  _id?: string;
  id: string;
  type: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  name: string;
  phone: string;
}

interface UserData {
  _id: string;
  name: string;
  phone: string;
  addresses: Address[];
  role: string;
  email?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ;

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserData>({
    _id: "",
    name: "",
    phone: "",
    addresses: [],
    role: "user",
  });

  // Get token & userId from your auth method (e.g., localStorage or context)

  useEffect(() => {
    const fetchUser = async () => {
      let userId = localStorage.getItem("UserId");
let token = localStorage.getItem("token");
const userID=localStorage.getItem("UserId");
    const UserId = userID?.replace(/"/g, "");
      if (!token || !UserId) {
        setError("You must be logged in to edit profile");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/users/${UserId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
console.log("Fetch user response status:", response.status);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Failed to fetch user");
        }

        const userData: UserData = await response.json();

        setFormData({
          _id: userData._id,
          name: userData.name || "",
          phone: userData.phone || "",
          addresses: userData.addresses || [],
          role: userData.role || "user",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userID=localStorage.getItem("UserId");
    const userId = userID?.replace(/"/g, "");
    if (!token || !userId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          addresses: formData.addresses,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. 03001234567"
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
              <span className="text-sm text-gray-500">
                {formData.addresses.length} address{formData.addresses.length !== 1 ? "es" : ""}
              </span>
            </div>

            {formData.addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No addresses added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.addresses.map((addr, index) => (
                  <div
                    key={addr.id}
                    className={`p-5 border rounded-xl ${
                      addr.isDefault
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-gray-600 mt-1">
                          {addr.street}
                          {addr.apartment && `, ${addr.apartment}`}
                          <br />
                          {addr.city}, {addr.state} {addr.postalCode}
                          <br />
                          {addr.country}
                        </p>
                        <p className="text-gray-600 mt-2">Phone: {addr.phone}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/addresses")} // Or open a modal to add/edit
              className="mt-6 text-indigo-600 font-medium hover:underline"
            >
              Manage Addresses →
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}