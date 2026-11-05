import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag, ChevronRight } from "lucide-react";

import ProductGallery from "@/components/card/ProductGallery";
import ProductTabs from "@/components/card/ProductTabs";
import ReviewsSection from "@/components/card/ReviewsSection";
import AddReviewForm from "@/components/card/AddReviewForm";
import ProductActions from "@/components/card/ProducActions";

import LiveViewers from "@/components/LiveViewers";

const safeString = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return safeString(record.name || record.title || record._id || "");
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

  const imageList: unknown[] = Array.isArray(product.images) ? product.images : [];
  const images = [
    ...(product.thumbnail ? [{ id: "main", url: product.thumbnail }] : []),
    ...imageList.flatMap((image, index) => {
      if (
        typeof image !== "object" ||
        image === null ||
        !("url" in image) ||
        typeof image.url !== "string" ||
        image.url.length === 0
      ) {
        return [];
      }

      const id = "_id" in image && typeof image._id === "string" ? image._id : `image-${index}`;
      return [{ id, url: image.url }];
    }),
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
    : [];

  const originalPrice = Number(product.price) || 0;
  const salePrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - salePrice!) / originalPrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? salePrice! : originalPrice;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <li>
              <Link href="/" className="hover:text-slate-950">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            {product.category && (
              <>
                <li>
                  <Link
                    href={`/categories/${product.category.slug || product.category._id || ""}`}
                    className="hover:text-slate-950"
                  >
                    {safeString(product.category)}
                  </Link>
                </li>
                <ChevronRight className="h-3 w-3 text-slate-300" />
              </>
            )}
            <li aria-current="page" className="max-w-[200px] truncate text-slate-900 sm:max-w-sm">
              {safeString(product.name)}
            </li>
          </ol>
        </nav>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">

          {/* LEFT: Gallery + Tabs */}
          <div className="space-y-6 lg:col-span-7">

            {/* Gallery card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ProductGallery images={images} productName={safeString(product.name)} />
            </div>

            {/* Tags row */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: { _id: string; name: string; color?: string }) => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                    style={tag.color ? {
                      color: tag.color,
                      borderColor: tag.color + "40",
                      backgroundColor: tag.color + "12",
                    } : undefined}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tabs card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ProductTabs
                descriptionPoints={descriptionPoints}
                specifications={product.specifications}
                highlights={product.highlights}
              />
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">

            {/* Title + Brand */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {safeString(product.brand)}
                  </p>
                )}
                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                  {safeString(product.name)}
                </h1>
              </div>

              {/* Stock badge */}
              <div className="flex flex-wrap items-center gap-2">
                {product.stock > 0 && product.stock <= 10 ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Only {product.stock} left in stock
                  </span>
                ) : product.stock === 0 ? (
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                    Out of stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LiveViewers productId={product._id} />
            </div>
            {/* Price */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {displayPrice.toLocaleString("en-PK")}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      {product.currency || "PKR"}
                    </span>
                  </div>
                  {hasDiscount && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-slate-400 line-through">
                        {originalPrice.toLocaleString("en-PK")} {product.currency || "PKR"}
                      </span>
                      <span className="text-xs font-medium text-emerald-700">
                        You save {(originalPrice - displayPrice).toLocaleString("en-PK")} {product.currency || "PKR"}
                      </span>
                    </div>
                  )}
                </div>

                {hasDiscount && (
                  <div className="flex-shrink-0">
                    <span className="block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                      -{discountPercentage}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Size + Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <form id="product-form" className="space-y-6">
                {availableSizes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-slate-800">
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
                          <div className="min-w-[52px] rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:border-slate-500 peer-checked:border-slate-950 peer-checked:bg-slate-950 peer-checked:text-white">
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

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <ReviewsSection productId={product._id} />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Write a review
          </h2>
          <AddReviewForm productId={product._id} />
        </section>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-12 pb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Explore more
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">You may also like</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map((item: {
                _id: string;
                name: string;
                thumbnail: string;
                price: number;
                discountPrice?: number;
              }) => {
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
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-400"
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
                          <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-900">
                            -{discPct}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 min-h-[2.8em] text-sm font-medium leading-relaxed text-slate-800 group-hover:text-slate-950">
                        {safeString(item.name)}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-base font-semibold text-slate-950">
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
    </main>
  );
}
