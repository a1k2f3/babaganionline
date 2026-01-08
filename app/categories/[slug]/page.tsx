// app/categories/[slug]/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";
import { Package, ArrowLeft, Grid3X3, List, Loader2, Clock } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string;
  images: { url: string }[];
  rating?: number;
  stock: number;
  status: string;
  category: { name: string; slug: string };
}

interface CategoryData {
  name: string;
  description?: string;
  productCount: number;
  imageUrl?: string;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE}/api/products/category/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          if (response.status === 404) {
            router.replace("/404");
            return;
          }
          throw new Error(`Failed to load products (${response.status})`);
        }

        const data = await response.json();

        let productsData: Product[] = [];
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data?.data) {
          productsData = data.data;
        } else if (data?.products) {
          productsData = data.products;
        }

        const activeProducts = productsData.filter(
          (p) => p.status === "active" && p.stock > 0
        );

        const fallbackName = slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        // If no active products → show "Coming Soon"
        if (activeProducts.length === 0) {
          setProducts([]);
          setCategory({
            name: fallbackName,
            productCount: 0,
            description: "We're working hard to bring you amazing products in this category.",
            imageUrl: "/images/fallback-category.jpg",
          });
          return;
        }

        const categoryName = activeProducts[0].category?.name || fallbackName;
        const heroImage =
          activeProducts[0]?.thumbnail ||
          activeProducts[0]?.images[0]?.url ||
          "/images/fallback-category.jpg";

        setProducts(activeProducts);
        setCategory({
          name: categoryName,
          productCount: activeProducts.length,
          description: `Explore ${activeProducts.length} handpicked products in ${categoryName}.`,
          imageUrl: heroImage,
        });
      } catch (err: any) {
        console.error("Failed to fetch category products:", err);
        setError("Unable to load products. Please try again later.");
        setProducts([]);

        const fallbackName = slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        setCategory({
          name: fallbackName,
          productCount: 0,
          description: "Category temporarily unavailable.",
          imageUrl: "/images/fallback-category.jpg",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, router]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-6" />
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // "Coming Soon" or Error State (when no products)
  if (!category || products.length === 0) {
    const displayName = category?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner - still show category image with dark overlay */}
        <div className="relative h-96 overflow-hidden">
          <Image
            src={category?.imageUrl || "/images/fallback-category.jpg"}
            alt={displayName}
            fill
            className="object-cover brightness-50"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold capitalize mb-6">
              {displayName}
            </h1>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full">
              <Clock className="w-8 h-8" />
              <p className="text-2xl font-medium">Coming Soon</p>
            </div>
            <p className="mt-10 text-xl max-w-2xl text-white/90">
              {error
                ? "Unable to load products right now. Please check back later."
                : "Exciting products are on the way! Stay tuned."}
            </p>
          </div>
        </div>

        {/* Bottom section with call to action */}
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <Package className="w-32 h-32 text-gray-300 mx-auto mb-8" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            We're curating the best items for this category. Check back soon for new arrivals!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Main Content with products (unchanged)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={category.imageUrl || "/images/fallback-category.jpg"}
          alt={category.name}
          fill
          className="object-cover brightness-50"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white capitalize">
              {category.name}
            </h1>
            <p className="mt-4 text-2xl text-white/90">
              {category.productCount} {category.productCount === 1 ? "Product" : "Products"}
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <p className="text-lg text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-semibold">{products.length}</span> products
          </p>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">View as:</span>
            <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-3 transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-3 transition-all ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
            >
              <Link href={`/product/${product._id}`} className="block">
                <div className={`relative overflow-hidden ${viewMode === "grid" ? "aspect-square" : "w-72 h-72"}`}>
                  <Image
                    src={product.thumbnail || product.images[0]?.url || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="font-semibold text-xl text-gray-900 line-clamp-2 mb-3">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-500 line-through">
                        RS{product.price}
                      </span>
                    </div>
                  </div>

                  {product.rating !== undefined && product.rating > 0 && (
                    <p className="mt-3 text-sm text-gray-600 flex items-center gap-1">
                      ⭐ <span className="font-medium">{product.rating.toFixed(1)}</span>
                      <span className="text-gray-500">rating</span>
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}