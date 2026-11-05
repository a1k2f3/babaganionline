// app/products/[id]/ProductHighlights.tsx
"use client";

import { Check } from "lucide-react";

interface ProductHighlightsProps {
  highlights: string[]; // e.g. ["Waterproof", "Wireless Charging", "1 Year Warranty"]
}

export default function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        Key Highlights
      </h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                <Check className="h-3 w-3 text-slate-700" />
              </div>
            </div>
            <span className="text-sm font-medium leading-relaxed text-slate-700">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}