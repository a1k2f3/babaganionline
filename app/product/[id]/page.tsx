import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, Shield, CheckCircle } from "lucide-react";

import ProductGallery from "@/components/card/ProductGallery";
import ProductActions from "@/components/card/ProducActions";
import ProductTabs from "@/components/card/ProductTabs";
import AddReviewForm from "@/components/card/AddReviewForm";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ReviewsSection = dynamic(() => import("@/components/card/ReviewsSection"), {
  loading: () => <ReviewSectionSkeleton />,
  ssr: true,
});

const RelatedProducts = dynamic(() => import("@/components/card/RelatedProducts"), {
  loading: () => <RelatedProductsSkeleton />,
  ssr: true,
});

async function getProduct(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) throw new Error("API URL not set!");

  const res = await fetch(`${apiUrl}/api/products/${id}`, {
    cache: "no-store",
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return await res.json();
}

function ReviewSectionSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-64" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-10 bg-gray-300 rounded-full" />
              <div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productData = await getProduct(id);

  if (!productData || !productData.success) {
    notFound();
  }

  const { data: product, relatedProducts } = productData;

  const images = [
    { id: "main", url: product.thumbnail },
    ...(product.images?.map((img: any) => ({ id: img._id, url: img.url })) || []),
  ];

  const availableSizes: string[] = Array.isArray(product.size) ? product.size : [];

  const descriptionPoints = product.description
    ? product.description
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => line.replace(/^[-•*·]\s*/, "").trim())
    : ["Premium quality material", "Comfortable fit", "Stylish design", "Durable and long-lasting"];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Ultra-minimal Breadcrumb */}
        <nav className="py-3 text-xs sm:text-sm text-gray-500">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            {product.category && (
              <>
                <li><Link href={`/category/${product.category.slug}`} className="hover:text-indigo-600">{product.category.name}</Link></li>
                <li className="text-gray-400">/</li>
              </>
            )}
            <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-4 lg:mt-8">

          {/* Gallery - Full width on mobile */}
          <div className="order-1 lg:order-1">
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-2">

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        i < Math.round(product.rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm sm:text-base text-gray-600">
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </div>

                {product.stock > 0 && product.stock < 10 && (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Hurry! Only {product.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="py-6 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-indigo-600">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl sm:text-2xl text-gray-600">{product.currency || "RS"}</span>
              </div>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size, idx) => (
                    <label key={size} className="cursor-pointer">
                      <input
                        type="radio"
                        name="selectedSize"
                        value={size}
                        className="sr-only peer"
                        defaultChecked={idx === 0}
                        required
                      />
                      <span className="inline-block px-6 py-4 text-center rounded-xl border-2 border-gray-300 text-gray-800 font-medium text-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-all hover:border-indigo-500">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Actions - Sticky on mobile if supported */}
            <div className="py-4">
              <ProductActions product={product} formId="product-form" />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-200">
              <div className="flex flex-col items-center text-center text-sm text-gray-600">
                <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                <span>Free Delivery<br />over 5000 RS</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm text-gray-600">
                <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                <span>Secure<br />Payment</span>
              </div>
              <div className="flex flex-col items-center text-center text-sm text-gray-600">
                <CheckCircle className="w-8 h-8 text-indigo-600 mb-2" />
                <span>30-Day<br />Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specs, etc. - Below gallery on mobile */}
        <div className="mt-12 lg:mt-16">
          <ProductTabs
            descriptionPoints={descriptionPoints}
            specifications={product.specifications}
            highlights={product.highlights}
          />
        </div>

        {/* Reviews Section */}
        <section className="mt-16 lg:mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h2>
          </div>
          <Suspense fallback={<ReviewSectionSkeleton />}>
            <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
          </Suspense>
        </section>

        {/* Write a Review */}
        <section className="mt-16 bg-white rounded-3xl shadow-lg p-6 sm:p-10 border">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Share Your Experience</h2>
          <AddReviewForm productId={product._id} />
        </section>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-20 lg:mt-28">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">You May Also Like</h2>
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedProducts products={relatedProducts} />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  );
}