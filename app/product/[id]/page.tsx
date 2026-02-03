// app/products/[id]/page.tsx
// SERVER COMPONENT

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, Shield, Check } from "lucide-react";
import ProductGallery from "@/components/card/ProductGallery";
import ReviewsSection from "@/components/card/ReviewsSection";
import ProductTabs from "@/components/card/ProductTabs";
import AddReviewForm from "@/components/card/AddReviewForm";
import ProductActions from "@/components/card/ProducActions";

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-3 text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
            </li>
            <span className="text-gray-400">/</span>
            {product.category && (
              <>
                <li>
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <span className="text-gray-400">/</span>
              </>
            )}
            <li className="text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-lg">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left: Gallery + Tabs */}
          <div className="space-y-10 lg:space-y-12 order-1 lg:order-none">
            <ProductGallery images={images} productName={product.name} />

            <ProductTabs
              descriptionPoints={descriptionPoints}
              specifications={product.specifications}
              highlights={product.highlights}
            />

            <div className="lg:hidden">
              <ReviewsSection productId={product._id} />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8 lg:space-y-10 lg:sticky lg:top-6 self-start">
            {/* Title & Rating/Stock */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-4.5xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* Rating (placeholder – replace with real data when available) */}
                s

                {product.stock > 0 && product.stock <= 10 && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full border border-red-200">
                    Only {product.stock} left!
                  </span>
                )}

                {product.stock === 0 && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
                    {displayPrice.toLocaleString("en-PK")}
                  </span>
                  <span className="text-2xl font-semibold text-gray-700 mb-2">
                    {product.currency || "PKR"}
                  </span>

                  {hasDiscount && (
                    <span className="ml-5 mb-3 inline-flex items-center px-4 py-1.5 bg-red-600 text-white font-bold text-base rounded-full shadow-sm">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="text-lg text-gray-500 line-through">
                    {originalPrice.toLocaleString("en-PK")} {product.currency || "PKR"}
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection + Actions */}
            <form id="product-form" className="space-y-8">
              {availableSizes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Select Size
                  </h3>
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
                        <div
                          className={`
                            min-w-16 px-5 py-3 rounded-xl border-2 border-gray-200 
                            text-gray-800 font-medium text-center transition-all
                            hover:border-indigo-500 hover:shadow
                            peer-checked:border-indigo-600 peer-checked:bg-indigo-50 
                            peer-checked:text-indigo-700 peer-checked:font-semibold
                          `}
                        >
                          {size}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <ProductActions product={product} formId="product-form" />
              </div>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 sm:gap-10 text-sm text-gray-700 font-medium">
              <div className="flex items-center gap-2.5">
                <Truck className="h-6 w-6 text-indigo-600" />
                Free delivery over 5000 PKR
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="h-6 w-6 text-indigo-600" />
                Secure payment
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-6 w-6 text-indigo-600" />
                7-day returns
              </div>
            </div>

            {/* Write a Review */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Write a Review
              </h2>
              <AddReviewForm productId={product._id} />
            </div>

            {/* Desktop Reviews */}
            <div className="hidden lg:block pt-6">
              <ReviewsSection productId={product._id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-16 lg:mt-24 pb-16">
            <h2 className="mb-10 text-3xl font-bold text-gray-900 text-center lg:text-left">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.map((item: any) => {
                const hasDisc =
                  item.discountPrice && Number(item.discountPrice) < Number(item.price);
                const dispPrice = hasDisc ? Number(item.discountPrice) : Number(item.price);

                return (
                  <Link
                    key={item._id}
                    href={`/products/${item._id}`} // note: changed to /products/ to match your route
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.name || "Related product"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {hasDisc && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded-full shadow-sm">
                            {Math.round(
                              ((Number(item.price) - Number(item.discountPrice)) /
                                Number(item.price)) *
                                100
                            )}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors min-h-[2.8em]">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2.5">
                        <span className="font-bold text-lg text-gray-900">
                          {dispPrice.toLocaleString("en-PK")}
                        </span>
                        {hasDisc && (
                          <span className="text-sm text-gray-500 line-through">
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