import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, Shield, Check, Tag, ChevronRight } from "lucide-react";

import ProductGallery from "@/components/card/ProductGallery";
import ProductTabs from "@/components/card/ProductTabs";
import ReviewsSection from "@/components/card/ReviewsSection";
import AddReviewForm from "@/components/card/AddReviewForm";
import ProductActions from "@/components/card/ProducActions";

import GoogleLoginPrompt from "@/components/GoogleLoginPrompt";

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

  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice!) / originalPrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? salePrice! : originalPrice;

  return (
    <div className="min-h-screen bg-[#f8f8f6]">

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-slate-400 font-medium tracking-wide uppercase">
            <li>
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            {product.category && (
              <>
                <li>
                  <Link
                    href={`/categories/${product.category.slug || product.category._id || ""}`}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {safeString(product.category)}
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3 text-slate-300" />
              </>
            )}
            <li className="text-slate-600 truncate max-w-[200px] sm:max-w-sm normal-case">
              {safeString(product.name)}
            </li>
          </ol>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

          {/* LEFT: Gallery + Tabs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Gallery card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <ProductGallery images={images} productName={safeString(product.name)} />
            </div>

            {/* Tags row */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: any) => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      color: tag.color,
                      borderColor: tag.color + "40",
                      backgroundColor: tag.color + "12",
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tabs card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <ProductTabs descriptionPoints={descriptionPoints} />
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 self-start space-y-5">

            {/* Title + Brand */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-xs font-bold tracking-widest text-orange-500 uppercase">
                    {safeString(product.brand)}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {safeString(product.name)}
                </h1>
              </div>

              {/* Stock badge */}
              <div className="flex flex-wrap items-center gap-2">
                {product.stock > 0 && product.stock <= 10 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Only {product.stock} left in stock
                  </span>
                ) : product.stock === 0 ? (
                  <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">
                    Out of stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    In stock
                  </span>
                )}
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginPrompt />

            {/* Price */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {displayPrice.toLocaleString("en-PK")}
                    </span>
                    <span className="text-base font-semibold text-slate-400">
                      {product.currency || "PKR"}
                    </span>
                  </div>
                  {hasDiscount && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-slate-400 line-through">
                        {originalPrice.toLocaleString("en-PK")} {product.currency || "PKR"}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        You save {(originalPrice - displayPrice).toLocaleString("en-PK")} {product.currency || "PKR"}
                      </span>
                    </div>
                  )}
                </div>

                {hasDiscount && (
                  <div className="flex-shrink-0">
                    <span className="block px-3 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-200">
                      -{discountPercentage}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Size + Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <form id="product-form" className="space-y-6">
                {availableSizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-3">
                      Select Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
                          <div className="min-w-[52px] px-4 py-2.5 text-center text-sm font-semibold rounded-xl border-2 border-slate-200 text-slate-600 transition-all duration-150 hover:border-orange-400 hover:text-orange-600 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700">
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

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: <Truck className="h-4 w-4 text-orange-500" />,
                  title: "Free Delivery",
                  sub: "Over 5000 PKR",
                },
                {
                  icon: <Shield className="h-4 w-4 text-orange-500" />,
                  title: "Secure Pay",
                  sub: "100% Protected",
                },
                {
                  icon: <Check className="h-4 w-4 text-orange-500" />,
                  title: "Easy Returns",
                  sub: "7 Days Policy",
                },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{badge.title}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Review form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-5">
                Write a Review
              </h2>
              <AddReviewForm productId={product._id} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewsSection productId={product._id} />
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-16 pb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-1">
                  Explore more
                </p>
                <h2 className="text-2xl font-bold text-slate-900">You May Also Like</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map((item: any) => {
                const hasDisc =
                  item.discountPrice && Number(item.discountPrice) < Number(item.price);
                const dispPrice = hasDisc ? Number(item.discountPrice) : Number(item.price);
                const discPct = hasDisc
                  ? Math.round(
                      ((Number(item.price) - Number(item.discountPrice)) / Number(item.price)) * 100
                    )
                  : 0;

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <Image
                        src={item.thumbnail}
                        alt={safeString(item.name)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {hasDisc && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-lg shadow">
                            -{discPct}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-xs font-medium text-slate-700 group-hover:text-orange-600 transition-colors leading-relaxed min-h-[2.8em]">
                        {safeString(item.name)}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-slate-900">
                          {dispPrice.toLocaleString("en-PK")}
                        </span>
                        {hasDisc && (
                          <span className="text-xs text-slate-400 line-through">
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
