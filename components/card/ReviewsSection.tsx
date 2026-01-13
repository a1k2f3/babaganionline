// app/products/[id]/ReviewsSection.tsx
"use client";

import useSWR from "swr";
import { Star } from "lucide-react";
import Image from "next/image";

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

interface ReviewsResponse {
  message: string;
  success: boolean;
  count: number;
  averageRating: string;
  reviews: Review[];
}

// Optional: you can add more fetcher options later (auth, etc.)
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    // You can add credentials, headers, etc. here if needed
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  if (!res.ok) {
    const error = new Error("Failed to fetch reviews") as Error & {
      status?: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json() as Promise<ReviewsResponse>;
};

export default function ReviewsSection({ productId }: { productId: string }) {
  const {
    data,
    error,
    isLoading,
  } = useSWR<ReviewsResponse>(
    productId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/product/${productId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,       // optional: change based on your needs
      revalidateOnReconnect: false,
      dedupingInterval: 60000,        // 1 minute cache
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="mt-20 py-12 bg-white rounded-2xl shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Loading reviews...
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="mt-20 py-12 bg-white rounded-2xl shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-red-600">
            {error.message || "Failed to load reviews. Please try again later."}
          </p>
        </div>
      </section>
    );
  }

  // Data is available
  const reviews = data?.reviews || [];
  const averageRating = data?.averageRating || "0.0";
  const avgRating = parseFloat(averageRating);

  // No reviews
  if (reviews.length === 0) {
    return (
      <section className="mt-20 py-12 bg-white rounded-2xl shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20 py-12 bg-white rounded-2xl shadow-lg">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        {/* Average Rating */}
        <div className="flex items-center gap-5 mb-10">
          <div className="text-6xl font-extrabold text-indigo-600">
            {avgRating.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${
                    i < Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-2 text-lg">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-10">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-10 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {review.user.avatar ? (
                    <Image
                      src={review.user.avatar}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500 bg-gray-200">
                      {review.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h4 className="font-semibold text-lg">{review.user.name}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}