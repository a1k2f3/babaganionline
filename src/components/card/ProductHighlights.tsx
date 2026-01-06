// app/products/[id]/ProductHighlights.tsx
"use client";

import { Check } from "lucide-react";

interface ProductHighlightsProps {
  highlights: string[]; // e.g. ["Waterproof", "Wireless Charging", "1 Year Warranty"]
}

export default function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
      <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        Key Highlights
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-gray-700 font-medium leading-relaxed">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}