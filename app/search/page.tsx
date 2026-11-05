import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResultsClient from "@/components/card/SearchResultsClient";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search products available at Baba Gani Online.",
  robots: { index: false, follow: true },
};

function SearchLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-52 animate-pulse rounded bg-slate-200" />
      <div className="mb-8 h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResultsClient />
    </Suspense>
  );
}
