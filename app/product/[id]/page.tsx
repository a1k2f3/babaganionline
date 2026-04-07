// app/products/[id]/page.tsx
// SERVER COMPONENT - Enhanced Design with Safe Rendering

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, Shield, Check } from "lucide-react";

import ProductGallery from "@/components/card/ProductGallery";
import ProductTabs from "@/components/card/ProductTabs";
import ReviewsSection from "@/components/card/ReviewsSection";
import AddReviewForm from "@/components/card/AddReviewForm";
import ProductActions from "@/components/card/ProducActions";

import GoogleLoginPrompt from "@/components/GoogleLoginPrompt";

// Helper to safely render strings (prevents "Objects are not valid as a React child" error)
const safeString = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    return value.name || value.title || value._id || "";
  }
  return String(value);
};

async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/api/products/${id}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[getProduct] Fetch error:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productData = await getProduct(id);

  if (!productData || !productData.success || !productData.data) {
    notFound();
  }

  const { data: product, relatedProducts } = productData;

  const images = [
    { id: "main", url: product.thumbnail },
    ...(product.images?.map((img: any) => ({ id: img._id, url: img.url })) || []),
  ];

  const availableSizes: string[] = Array.isArray(product.size)
    ? product.size
    : product.size
    ? [product.size]
    : [];

  const descriptionPoints = product.description
    ? product.description
        .split(/[\r\n]+/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => line.replace(/^[-•*]\s*/, "").trim())
    : ["Quality fabric", "Comfortable fit", "Modern design"];

  // Price calculations
  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? salePrice : originalPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-3 text-gray-500">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-all duration-200">
                Home
              </Link>
            </li>
            <span className="text-gray-300">›</span>
            {product.category && (
              <>
                <li>
                  <Link
                    href={`/categories/${product.category.slug || product.category._id || ""}`}
                    className="hover:text-indigo-600 transition-all duration-200"
                  >
                    {safeString(product.category)}
                  </Link>
                </li>
                <span className="text-gray-300">›</span>
              </>
            )}
            <li className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
              {safeString(product.name)}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* LEFT COLUMN: Gallery + Tabs */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-14">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 p-4">
              <ProductGallery images={images} productName={safeString(product.name)} />
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 p-8">
              <ProductTabs 
                descriptionPoints={descriptionPoints}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-8 self-start space-y-10">
            
            {/* Header */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tighter">
                  {safeString(product.name)}
                </h1>
                
                {/* Safe Brand Rendering */}
                {product.brand && (
                  <p className="mt-2 text-lg text-gray-500 font-medium">
                    {safeString(product.brand)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex flex-wrap items-center gap-4">
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-2xl border border-amber-200">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Only {product.stock} left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="inline-flex items-center px-4 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-2xl">
                    Out of stock
                  </div>
                )}
              </div>
            </div>

            {/* Google Login Prompt */}
            <GoogleLoginPrompt />

            {/* Price Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/80 border border-gray-100">
              <div className="flex items-end gap-4">
                <span className="text-6xl font-bold text-gray-900 tracking-tighter">
                  {displayPrice.toLocaleString("en-PK")}
                </span>
                <span className="text-2xl text-gray-600 font-medium mb-2">
                  {product.currency || "PKR"}
                </span>

                {hasDiscount && (
                  <div className="ml-auto flex flex-col items-end">
                    <span className="px-5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-lg font-bold rounded-2xl shadow-md">
                      -{discountPercentage}%
                    </span>
                    <div className="text-sm text-gray-500 line-through mt-1">
                      {originalPrice.toLocaleString("en-PK")} {product.currency || "PKR"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection + Actions */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/80 border border-gray-100">
              <form id="product-form" className="space-y-9">
                {availableSizes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-5">Select Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {availableSizes.map((size, index) => (
                        <label key={size} className="cursor-pointer">
                          <input
                            type="radio"
                            name="selectedSize"
                            value={size}
                            className="peer sr-only"
                            defaultChecked={index === 0}
                            required
                          />
                          <div className="min-w-[62px] px-6 py-3.5 text-center font-semibold rounded-2xl border-2 border-gray-200 transition-all duration-200 hover:border-indigo-400 hover:shadow-md peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:shadow-lg">
                            {size}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <ProductActions product={product} formId="product-form" />
              </form>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-10 gap-y-6 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">Over 5000 PKR</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Protected</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">7 Days</p>
                </div>
              </div>
            </div>

            {/* Write a Review */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/80 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-7">Write a Review</h2>
              <AddReviewForm productId={product._id} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 lg:mt-24">
          <ReviewsSection productId={product._id} />
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-20 lg:mt-28 pb-12">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
              <Link href="/shop" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 group">
                View All 
                <span className="group-hover:translate-x-1 transition">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {relatedProducts.map((item: any) => {
                const hasDisc =
                  item.discountPrice && Number(item.discountPrice) < Number(item.price);
                const dispPrice = hasDisc ? Number(item.discountPrice) : Number(item.price);

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={item.thumbnail}
                        alt={safeString(item.name)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {hasDisc && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3.5 py-1 text-xs font-bold bg-red-600 text-white rounded-2xl shadow">
                            {Math.round(
                              ((Number(item.price) - Number(item.discountPrice)) /
                                Number(item.price)) *
                                100
                            )}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-2 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors min-h-[2.6em]">
                        {safeString(item.name)}
                      </h3>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {dispPrice.toLocaleString("en-PK")}
                        </span>
                        {hasDisc && (
                          <span className="text-sm text-gray-400 line-through">
                            {Number(item.price).toLocaleString("en-PK")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}