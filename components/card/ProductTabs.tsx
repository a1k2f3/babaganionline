// components/card/ProductTabs.tsx
"use client";

import { useState } from "react";
import ProductSpecs from "./ProductSpecs";
import ProductHighlights from "./ProductHighlights";


type TabType = "description" | "specifications" | "highlights";

interface ProductTabsProps {
  descriptionPoints: string[];
  specifications?: Record<string, any>;
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
      <div role="tablist" className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-8 px-6 sm:px-8 pt-6 -mb-px relative" aria-label="Product information tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-4 text-lg font-medium transition-colors relative z-10
                ${activeTab === tab.id
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {tab.label}
            </button>
          ))}

          {/* Animated underline indicator */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`,
            }}
          />
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* Description Panel */}
        {activeTab === "description" && (
          <div role="tabpanel" id="description-panel" className="prose prose-lg max-w-none">
            {descriptionPoints.length > 0 ? (
              <ul className="space-y-5 text-gray-700 leading-relaxed">
                {descriptionPoints.map((point, index) => {
                  const cleaned = point.trim();
                  if (!cleaned) return null;
                  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                  return (
                    <li key={index} className="flex items-start gap-4">
                      <span className="mt-2 w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />
                      <span className="text-base lg:text-lg">{capitalized}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No description available for this product.</p>
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
          <p className="text-gray-500 text-center py-8">
            No additional information available.
          </p>
        )}
      </div>
    </div>
  );
}