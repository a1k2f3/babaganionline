// app/products/[id]/ProductGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageItem {
  id: string;
  url: string;
}

export default function ProductGallery({
  images,
  productName,
}: {
  images: ImageItem[];
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0].url);

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom – made smaller */}
      <div className="relative mx-auto max-w-md aspect-square rounded-2xl overflow-hidden bg-white shadow-xl group">
        <div className="relative w-full h-full cursor-zoom-in">
          <Image
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 90vw, 448px"  // better for smaller display size
            quality={95}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.3] crisp-scale"
            priority
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails – unchanged */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.url)}
              onMouseEnter={() => setActiveImage(img.url)}
              className={`relative aspect-square rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                activeImage === img.url
                  ? "border-indigo-600 shadow-lg ring-4 ring-indigo-600/30"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}