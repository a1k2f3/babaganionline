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

  // Discount logic
  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const displayPrice = hasDiscount ? salePrice : originalPrice;

  return (
    <div className="min-h-screen bg-gray-50/40 py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-gray-600">
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
            <li className="font-medium text-gray-900 truncate max-w-[180px] xs:max-w-[260px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          {/* LEFT COLUMN - Gallery + Tabs + Mobile Reviews */}
          <div className="mx-auto w-full max-w-xl lg:max-w-none lg:mx-0 space-y-8 sm:space-y-10 lg:space-y-12">
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

          {/* RIGHT COLUMN - Product Info */}
          <div className="mx-auto w-full max-w-xl lg:max-w-none lg:mx-0 space-y-8 sm:space-y-10 lg:space-y-12">
            <div className="text-center lg:text-left">
              <h1 className="text-xl sm:text-3.5xl md:text-4xl lg:text-4.5xl font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        i < Math.round(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-600 font-medium">
                  {product.reviews?.length || 0} reviews
                </span>

                {product.stock > 0 && product.stock <= 10 && (
                  <span className="rounded-full bg-red-50 px-3.5 py-1 text-sm font-medium text-red-700 border border-red-200">
                    Only {product.stock} left!
                  </span>
                )}
              </div>
            </div>

            {/* ── PRICE SECTION WITH DISCOUNT ── */}
            <div className="border-b border-gray-200 pb-7">
              <div className="flex flex-col items-center lg:items-start gap-1.5">
                <div className="flex items-end gap-3 flex-wrap justify-center lg:justify-start">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-red-600">
                    {displayPrice.toLocaleString("en-IN")}
                  </span>

                  <span className="text-2xl sm:text-3xl font-medium text-gray-500 mb-1">
                    {product.currency || "PKR"}
                  </span>

                  {hasDiscount && discountPercentage > 5 && (
                    <span className="ml-4 mb-2 inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-base sm:text-lg font-bold rounded-full shadow-lg">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="text-base sm:text-lg text-gray-500 line-through opacity-80">
                    Original: {originalPrice.toLocaleString("en-IN")}{" "}
                    {product.currency || "PKR"}
                  </div>
                )}
              </div>
            </div>

            <form id="product-form" className="space-y-9">
              {availableSizes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-center lg:text-left text-lg font-semibold text-gray-800">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
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
                        <div className="min-w-[3.5rem] rounded-xl border-2 border-gray-300 px-4 py-2.5 text-base font-medium text-gray-700 transition-all hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:shadow-sm">
                          {size}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center lg:justify-start pt-2">
                <ProductActions product={product} formId="product-form" />
              </div>
            </form>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-4 text-sm sm:text-base text-gray-700">
              <div className="flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-indigo-600" />
                <span>Free delivery over 5000 PKR</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-5 w-5 text-indigo-600" />
                <span>7-day returns</span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-center lg:text-left text-xl sm:text-2xl font-bold text-gray-900">
                Write a Review
              </h2>
              <AddReviewForm productId={product._id} />
            </div>

            <div className="hidden lg:block lg:mt-8">
              <ReviewsSection productId={product._id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-16 sm:mt-20 lg:mt-24 pb-8 sm:pb-12">
            <h2 className="mb-8 text-center lg:text-left text-2xl sm:text-3xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 xs:gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
              {relatedProducts.map((item: any) => {
                const itemHasDiscount =
                  item.discountPrice &&
                  Number(item.discountPrice) < Number(item.price);

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {itemHasDiscount && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                            {Math.round(
                              ((Number(item.price) - Number(item.discountPrice)) /
                                Number(item.price)) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="line-clamp-2 text-sm sm:text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors min-h-[2.8em]">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="font-bold text-indigo-600 text-base sm:text-lg">
                          {itemHasDiscount
                            ? Number(item.discountPrice).toLocaleString("en-IN")
                            : Number(item.price).toLocaleString("en-IN")}
                        </p>
                        {itemHasDiscount && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            {Number(item.price).toLocaleString("en-IN")}
                          </p>
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