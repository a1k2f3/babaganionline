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
  const [activeImage, setActiveImage] = useState(images[0]?.url ?? "");

  return (
    <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            quality={82}
            className="object-contain"
            priority
          />
        ) : (
          <div className="absolute inset-0" aria-hidden="true" />
        )}
      </div>

      {images.length > 1 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              type="button"
              onClick={() => setActiveImage(image.url)}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-pressed={activeImage === image.url}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 sm:h-20 sm:w-20 ${
                activeImage === image.url
                  ? "border-slate-900"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
