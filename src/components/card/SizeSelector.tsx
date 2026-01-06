'use client';

import { useState } from "react";

interface SizeSelectorProps {
  availableSizes: string[];
}

export default function SizeSelector({ availableSizes }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size: string) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-14 h-14 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-indigo-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              selectedSize === size
                ? "border-indigo-600 text-indigo-600 font-bold"
                : ""
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {/* Optional: Show selected size */}
      {selectedSize && (
        <p className="text-sm text-gray-600">Selected: {selectedSize}</p>
      )}
    </div>
  );
}