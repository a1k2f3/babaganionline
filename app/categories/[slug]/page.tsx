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

  if (!category || products.length === 0) {
    const displayName =
      category?.name ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative h-screen overflow-hidden flex items-center justify-center">
          <Image
            src={category?.imageUrl || "/images/fallback-category.jpg"}
            alt={displayName}
            fill
            className="object-cover brightness-50"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-bold capitalize mb-8">
              {displayName}
            </h1>

            <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-md px-10 py-6 rounded-3xl shadow-2xl">
              <Clock className="w-12 h-12" />
              <p className="text-4xl md:text-5xl font-semibold">Coming Soon</p>
            </div>

            <p className="mt-12 text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              {error
                ? "Unable to load this category right now. Please try again later."
                : "We're preparing amazing products for you. Stay tuned!"}
            </p>

            <Link
              href="/"
              className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-medium text-lg rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              <ArrowLeft className="w-6 h-6" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN CONTENT ───────────────────────────────────────────────────────
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
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
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
              : "space-y-5"
          }
        >
          {products.map((product) => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const displayPrice = hasDiscount ? product.discountPrice : product.price;

            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`group bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden ${
                  viewMode === "list" ? "flex flex-row items-center gap-4 p-4" : ""
                }`}
              >
                <Link href={`/product/${product._id || product.slug}`} className="block w-full">
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid" ? "aspect-square" : "w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0"
                    }`}
                  >
                    <Image
                      src={product.thumbnail || product.images[0]?.url || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>

                  <div className={`p-3 sm:p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-green-700">
                        RS {displayPrice.toLocaleString()}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          RS {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {product.rating !== undefined && product.rating > 0 && (
                      <p className="mt-1.5 text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                        ⭐ <span className="font-medium">{product.rating.toFixed(1)}</span>
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}