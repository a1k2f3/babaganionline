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
// import ProductActions from "@/components/card/ProductActions"; // ← corrected typo
import ProductActions from "@/components/card/ProducActions";

async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fallback for local development
  const apiBase = baseUrl ;

  const url = `${apiBase}/api/products/${id}`;

  console.log("[getProduct] Fetching:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      // next: { revalidate: 60 }, // ← comment out while debugging
    });

    console.log("[getProduct] Status:", res.status);

    if (!res.ok) {
      console.log("[getProduct] Failed with status:", res.status);
      const errorText = await res.text().catch(() => "No error message");
      console.log("[getProduct] Error response:", errorText);
      return null;
    }

    const data = await res.json();
    console.log("[getProduct] Success - data keys:", Object.keys(data));

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

  console.log("[ProductPage] Requested product ID:", id);

  const productData = await getProduct(id);

  // Debug output
  if (!productData) {
    console.log("[ProductPage] Product data is null/undefined");
  } else if (!productData.success) {
    console.log("[ProductPage] API returned success: false", productData);
  }

  if (!productData || !productData.success || !productData.data) {
    console.log("[ProductPage] Triggering notFound()");
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 md:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            {product.category && (
              <>
                <li>
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="hover:text-indigo-600"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
              </>
            )}
            <li className="font-medium text-gray-900 truncate max-w-[180px] md:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
          {/* Gallery + Tabs (mobile) */}
          <div className="space-y-8 lg:space-y-10">
            <ProductGallery images={images} productName={product.name} />

            <ProductTabs
              descriptionPoints={descriptionPoints}
              specifications={product.specifications}
              highlights={product.highlights}
            />

            <div className="lg:hidden mt-10">
              <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8 lg:space-y-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.reviews?.length || 0} reviews
                </span>

                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Only {product.stock} left!
                  </span>
                )}
              </div>
            </div>

            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-bold text-indigo-600">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl md:text-2xl font-medium text-gray-600">
                  {product.currency || "PKR"}
                </span>
              </div>
            </div>

            <form id="product-form" className="space-y-8">
              {availableSizes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size, index) => (
                      <label key={size} className="cursor-pointer">
                        <input
                          type="radio"
                          name="selectedSize"
                          value={size}
                          className="sr-only peer"
                          defaultChecked={index === 0}
                          required
                        />
                        <div className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:bg-indigo-50 hover:border-indigo-400">
                          {size}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <ProductActions product={product} formId="product-form" />
            </form>

            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span>Free delivery over 5000 PKR</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-indigo-600" />
                <span>30-day returns</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Write a Review</h2>
              <AddReviewForm productId={product._id} />
            </div>

            <div className="hidden lg:block mt-12">
              <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-20 md:mt-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {relatedProducts.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/products/${item._id}`}
                  className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-indigo-600 text-sm md:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-indigo-600 font-bold text-base md:text-lg">
                      {item.price.toLocaleString()} {item.currency || "PKR"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}