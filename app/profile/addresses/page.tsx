"use client";



import React, { useEffect, useState } from 'react';

// Define the Address type (adjust if you have it elsewhere)
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api.com'; // Adjust as needed
function Page() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
     const getToken = () => localStorage.getItem("token");
  const getUserId = () => localStorage.getItem("UserId")?.replace(/"/g, "");
    if (!getToken() || !getUserId()) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      const userID = getUserId();

      const response = await fetch(`${API_BASE}/api/users/addresses/${userID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
console.log('Fetch addresses response status:', response.status); 
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch addresses');
      }

      const data = await response.json();

      // Handle both { addresses: [...] } and direct array
      const addrList = Array.isArray(data) ? data : data.addresses || [];

      const mapped: Address[] = addrList.map((addr: any) => ({
        _id: addr._id,
        id: addr._id || addr.id,
        type: addr.type || 'home',
        street: addr.street || '',
        apartment: addr.apartment || '',
        city: addr.city || '',
        state: addr.state || '',
        postalCode: addr.postalCode || '',
        country: addr.country || 'Pakistan',
        isDefault: addr.isDefault || false,
        name: addr.name || 'Home Address',
        phone: addr.phone || '',
      }));

      setAddresses(mapped);

      // Auto-select default address
      const defaultIdx = mapped.findIndex((a) => a.isDefault);
      if (defaultIdx !== -1) {
        setSelectedAddressIndex(defaultIdx);
      } else if (mapped.length > 0) {
        setSelectedAddressIndex(0);
      }
    } catch (err: any) {
      console.error('Error fetching addresses:', err);
      setError(err.message || 'Something went wrong');

      // Fallback dummy data
      const fallback: Address[] = [
        {
          id: 'fallback-1',
          type: 'home',
          street: 'House #123, Street 45',
          apartment: '',
          city: 'Lahore',
          state: 'Punjab',
          postalCode: '54000',
          country: 'Pakistan',
          isDefault: true,
          name: 'Kamran Ali',
          phone: '03001234567',
        },
      ];
      setAddresses(fallback);
      setSelectedAddressIndex(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (error && addresses.length === 0) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddressIndex(index)}
              className={`p-5 border rounded-lg cursor-pointer transition-all ${
                selectedAddressIndex === index
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{address.name}</h3>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">
                    {address.street} {address.apartment && `, ${address.apartment}`}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </p>
                  <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                </div>

                {selectedAddressIndex === index && (
                  <div className="text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          Note: Showing fallback address due to an error ({error}).
        </p>
      )}
    </div>
  );
}

export default Page;