// components/card/ProductTabs.tsx
"use client";

import { useState } from "react";
import ProductSpecs from "./ProductSpecs";
import ProductHighlights from "./ProductHighlights";


type TabType = "description" | "specifications" | "highlights";

interface ProductTabsProps {
  descriptionPoints: string[];
  specifications?: Record<string, unknown>;
  highlights?: string[];
}

export default function ProductTabs({
  descriptionPoints,
  specifications,
  highlights,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const hasSpecs = specifications && Object.keys(specifications).length > 0;
  const hasHighlights = highlights && highlights.length > 0;

  const tabs = [
    { id: "description" as const, label: "Description", alwaysShow: true },
    { id: "specifications" as const, label: "Specifications", alwaysShow: hasSpecs },
    { id: "highlights" as const, label: "Key Highlights", alwaysShow: hasHighlights },
  ].filter((tab) => tab.alwaysShow);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div role="tablist" className="border-b border-slate-200">
        <nav className="relative -mb-px flex flex-wrap gap-6 px-5 pt-4 sm:gap-8 sm:px-6" aria-label="Product information tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative z-10 pb-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? "text-slate-950"
                  : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              {tab.label}
            </button>
          ))}

          {/* Animated underline indicator */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-slate-950 transition-all duration-300 ease-out"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`,
            }}
          />
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6">
        {/* Description Panel */}
        {activeTab === "description" && (
          <div role="tabpanel" id="description-panel" className="max-w-none">
            {descriptionPoints.length > 0 ? (
              <ul className="space-y-3 text-sm leading-6 text-slate-700">
                {descriptionPoints.map((point, index) => {
                  const cleaned = point.trim();
                  if (!cleaned) return null;
                  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span>{capitalized}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No description available for this product.</p>
            )}
          </div>
        )}

        {/* Specifications Panel */}
        {activeTab === "specifications" && hasSpecs && (
          <div role="tabpanel" id="specifications-panel">
            <ProductSpecs specs={specifications!} />
          </div>
        )}

        {/* Highlights Panel */}
        {activeTab === "highlights" && hasHighlights && (
          <div role="tabpanel" id="highlights-panel">
            <ProductHighlights highlights={highlights!} />
          </div>
        )}

        {/* Fallback when no content (shouldn't happen due to filtering, but safe) */}
        {activeTab !== "description" && !hasSpecs && !hasHighlights && (
          <p className="py-8 text-center text-sm text-slate-500">
            No additional information available.
          </p>
        )}
      </div>
    </div>
  );
}