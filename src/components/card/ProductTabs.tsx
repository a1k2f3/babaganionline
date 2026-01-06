'use client';

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

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-8 px-6 sm:px-8 pt-6 -mb-px">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === "description"
                ? "text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-selected={activeTab === "description"}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600" />
            )}
          </button>

          {hasSpecs && (
            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "specifications"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-selected={activeTab === "specifications"}
            >
              Specifications
              {activeTab === "specifications" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          )}

          {hasHighlights && (
            <button
              onClick={() => setActiveTab("highlights")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "highlights"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-selected={activeTab === "highlights"}
            >
              Key Highlights
              {activeTab === "highlights" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose prose-lg max-w-none">
            <ul className="space-y-4 text-gray-700 leading-relaxed">
              {descriptionPoints.length > 0 ? (
                descriptionPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="mt-1.5 w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />
                    <span className="text-base lg:text-lg">
                      {point.charAt(0).toUpperCase() + point.slice(1)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No description available.</li>
              )}
            </ul>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && hasSpecs && (
          <div>
            <ProductSpecs specs={specifications} />
          </div>
        )}

        {/* Highlights Tab */}
        {activeTab === "highlights" && hasHighlights && (
          <div>
            <ProductHighlights highlights={highlights} />
          </div>
        )}

        {/* Fallback if no content */}
        {!hasSpecs && !hasHighlights && activeTab !== "description" && (
          <p className="text-gray-500">No additional information available.</p>
        )}
      </div>
    </div>
  );
}