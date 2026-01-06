// app/search/page.tsx  (or wherever your search route is)

import { Suspense } from "react";
import SearchResultsClient from "@/components/card/SearchResultsClient";

// Optional: Add metadata for better SEO
export const metadata = {
  title: "Search Results",
  description: "Find products across our store",
};

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Searching products...</p>
          </div>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}