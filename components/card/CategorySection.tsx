"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryCard from "./CateGoryCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) throw new Error("API base URL is not configured");

        const response = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
          next: { revalidate: 3600 },
        });
        if (!response.ok) throw new Error(`Failed to load categories (${response.status})`);

        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid categories response");
        }

        setCategories(result.data.slice(0, 12));
      } catch (cause) {
        console.error("Categories fetch error:", cause);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  return (
    <section>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Baba Gani Online
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-2 text-sm text-slate-600">Browse available categories.</p>
        </div>
        {categories.length === 12 && !loading && (
          <Link
            href="/categories"
            className="shrink-0 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
          >
            View all
          </Link>
        )}
      </div>

      {error ? (
        <p role="status" className="py-8 text-sm text-slate-600">
          Categories are temporarily unavailable.
        </p>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="py-8 text-sm text-slate-600">No categories are available right now.</p>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-3 sm:grid sm:w-full sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                name={category.name}
                slug={category.slug}
                imageUrl={category.image.url}
                productCount={category.productCount}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
