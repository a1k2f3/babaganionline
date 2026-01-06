// components/card/AddReviewForm.tsx
"use client";

import { useState, useRef } from "react";
import { Star, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface Props {
  productId: string;
}

export default function AddReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    // Optional: limit file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add("border-indigo-500", "bg-indigo-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-indigo-500", "bg-indigo-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove("border-indigo-500", "bg-indigo-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    if (!name || !email || !comment) {
      setError("Name, email, and review are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("name", name);
      formData.append("email", email);
      formData.append("comment", comment);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`, {
        method: "POST",
        body: formData, // No Content-Type header — let browser set it with boundary
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess(true);
      // Reset form
      setRating(0);
      setName("");
      setEmail("");
      setComment("");
      setImage(null);
      setImagePreview(null);

      setTimeout(() => setSuccess(false), 6000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      {/* Image Upload - Drag & Drop */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add a Photo (Optional)
        </label>

        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
            className="hidden"
          />

          {!imagePreview ? (
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-gray-600 font-medium">Drag & drop an image here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Review preview"
                className="max-w-full max-h-64 rounded-lg object-cover shadow-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {image && (
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            {image.name}
          </p>
        )}
      </div>

      {/* Messages */}
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm font-medium">
          Thank you! Your review has been submitted and is pending approval.
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}