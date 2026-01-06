// app/products/[id]/ReviewsSection.tsx
"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

export default function ReviewsSection({
  reviews,
  rating,
}: {
  reviews: Review[];
  rating: number;
}) {
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

  const avgRating = rating || reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  return (
    <section className="mt-20 py-12 bg-white rounded-2xl shadow-lg">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        {/* Average Rating */}
        <div className="flex items-center gap-4 mb-10">
          <div className="text-5xl font-bold text-indigo-600">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-1">{reviews.length} verified reviews</p>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-8 last:border-0">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {review.user.avatar ? (
                    <Image src={review.user.avatar} alt={review.user.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{review.user.name}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
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

                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}