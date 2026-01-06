"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Loader2, ChevronDown } from "lucide-react";

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  name: string;
}

interface Image {
  url: string;
  public_id: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  images: Image[];
  category: Category;
  brand: Brand;
  tags: Tag[];
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PRODUCTS_PER_PAGE = 20;

  const fetchProducts = async (pageNum: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/random?limit=${PRODUCTS_PER_PAGE}&page=${pageNum}`
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || "No products found");
      }
    } catch (err: any) {
      throw err;
    }
  };

  // Initial load: first 20 products only
  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const initialProducts = await fetchProducts(1);
        setProducts(initialProducts);
        setHasMore(initialProducts.length === PRODUCTS_PER_PAGE);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  // Load More handler
  const loadMore = async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const moreProducts = await fetchProducts(nextPage);

      setProducts((prev) => [...prev, ...moreProducts]);
      setPage(nextPage);
      setHasMore(moreProducts.length === PRODUCTS_PER_PAGE);
    } catch (err: any) {
      console.error("Error loading more products:", err);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  // Initial Loading State
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
          <p className="mt-6 text-xl font-medium text-gray-700">
            Loading amazing products...
          </p>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-red-600 text-2xl font-semibold mb-4">Oops!</p>
          <p className="text-gray-700 text-lg mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stylish Header */}
        <div className="relative text-center mb-16 pt-12">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Discover our handpicked collection of premium items
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-2xl font-medium">
              No products available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button - Always visible if there are more products */}
        {hasMore && (
          <div className="flex justify-center mt-20">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={loadMore}
              disabled={isFetching}
              className={`
                group flex items-center gap-4 px-12 py-5 
                bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-700 hover:to-purple-700 
                text-white font-semibold text-lg rounded-2xl 
                shadow-2xl hover:shadow-purple-200/50 
                transition-all duration-300
                disabled:opacity-70 disabled:cursor-not-allowed
                border border-white/20
              `}
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <span>Loading more products...</span>
                </>
              ) : (
                <>
                  <span>Load More Products</span>
                  <ChevronDown className="w-7 h-7 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* End of Catalog Message */}
        
      </div>
    </section>
  );
}