// app/products/[id]/page.tsx
// SERVER COMPONENT

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, Shield, CheckCircle } from "lucide-react";


// import ProductGallery from "@/components/card/ProductGallery";
import ProductGallery from "@/components/card/ProductGallery";
import ProductActions from "@/components/card/ProducActions";
import ProductTabs from "@/components/card/ProductTabs";

// import AddReviewForm from "@/components/card/AddReviewForm";
import AddReviewForm from "@/components/card/AddReviewForm";
// Lazy load heavy sections
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Client components loaded only when needed
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

// Skeletons for better UX during loading
function ReviewSectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-6">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-24"> {/* Safe padding for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8 text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            {product.category && (
              <>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="hover:text-indigo-600 transition">
                    {product.category.name}
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
              </>
            )}
            <li className="font-medium text-gray-900 truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Gallery + Tabs (Mobile priority) */}
          <div className="space-y-8">
            <ProductGallery images={images} productName={product.name} />

            {/* Tabs: Description, Specs, Highlights */}
            <ProductTabs
              descriptionPoints={descriptionPoints}
              specifications={product.specifications}
              highlights={product.highlights}
            />

            {/* Reviews on Mobile */}
            <div className="lg:hidden">
              <Suspense fallback={<ReviewSectionSkeleton />}>
                <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
              </Suspense>
            </div>
          </div>

          {/* Right: Details + Actions */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center">
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
                  {product.reviews?.length || 0} Reviews
                </span>

                {product.stock > 0 && product.stock < 10 && (
                  <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-b pb-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl md:text-5xl font-bold text-indigo-600">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-600 pb-1">{product.currency || "RS"}</span>
              </div>
            </div>

            {/* Size Selector */}
            <form id="product-form" className="space-y-6">
              {availableSizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Size</h3>
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
                        <span className="block px-6 py-3 text-center rounded-lg border-2 border-gray-300 text-gray-700 font-medium peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all hover:border-indigo-400">
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart / Buy Now */}
              <ProductActions product={product} formId="product-form" />
            </form>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span>Free Delivery over 5000 RS</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-6 h-6 text-indigo-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>

            {/* Write a Review */}
            <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 border">
              <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
              <AddReviewForm productId={product._id} />
            </section>

            {/* Reviews on Desktop */}
            <div className="hidden lg:block">
              <Suspense fallback={<ReviewSectionSkeleton />}>
                <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Related Products - Lazy Loaded */}
        {relatedProducts?.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-bold mb-10">You May Also Like</h2>
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedProducts products={relatedProducts} />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  );
}