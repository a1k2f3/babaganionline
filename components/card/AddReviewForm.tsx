"use client";
import { useState, FormEvent } from 'react';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get userId safely
  const userId = typeof window !== 'undefined'
    ? localStorage.getItem('UserId')
      ? JSON.parse(localStorage.getItem('UserId') as string)
      : null
    : null;
 const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('UserId') as string)
      : null
    : null;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!userId) {
      setError('Please login to submit a review');
      return;
    }

    if (!productId) {
      setError('Product information is missing');
      return;
    }

    // Basic format check for MongoDB ObjectIds
    const isValidId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidId(userId) || !isValidId(productId)) {
      setError('Invalid session or product data. Please try logging in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you use JWT/token later
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: productId,
          user: userId,
          rating: rating,
          comment: comment.trim() || undefined,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          `Failed to submit review (${response.status})`
        );
      }

      // Success
      setRating(0);
      setComment('');
      setHoverRating(0);
      onReviewSubmitted?.();

      alert('Thank you! Your review has been submitted.');

    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
      console.error('Review submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Share Your Experience
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rate this product <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <span
                  className={`text-4xl transition-all duration-200 ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 drop-shadow'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 ? 'Very poor' :
               rating === 2 ? 'Poor' :
               rating === 3 ? 'Average' :
               rating === 4 ? 'Good' : 'Excellent'}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your review (optional)
          </label>
          <textarea
            id="comment"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike? Your honest feedback helps others..."
            maxLength={500}
            className="
              w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              resize-y min-h-[110px] transition-all
              placeholder:text-gray-400
            "
          />
          <div className="text-xs text-gray-500 text-right">
            {comment.length}/500 characters
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !userId || rating === 0}
            className={`
              px-8 py-3 rounded-lg font-medium text-white flex-1 sm:flex-none
              transition-all duration-200
              ${
                isSubmitting || !userId || rating === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </button>

          {!userId && (
            <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
              You need to be logged in to write a review
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;