// app/products/[id]/ProductGallery.tsx
"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"

interface ImageItem {
  id: string
  url: string
}

export default function ProductGallery({
  images,
  productName,
}: {
  images: ImageItem[]
  productName: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]

  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-4 md:space-y-5 max-w-md lg:max-w-lg mx-auto lg:mx-0">
      {/* MAIN IMAGE – Daraz-like compact size */}
      <div
        className={`
          relative 
          aspect-square sm:aspect-[5/6] md:aspect-square 
          w-full max-w-[480px] lg:max-w-[500px] 
          mx-auto lg:mx-0
          rounded-xl md:rounded-2xl 
          overflow-hidden 
          bg-gray-50 
          shadow-md 
          border border-gray-200/70
          cursor-zoom-in
        `}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => {
          setIsZoomed(false)
          setMousePosition({ x: 50, y: 50 })
        }}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url}
          alt={`${productName} - main view`}
          fill
          sizes={`
            (max-width: 540px) 90vw,
            (max-width: 768px) 75vw,
            (max-width: 1024px) 50vw,
            (max-width: 1280px) 42vw,
            480px
          `}
          quality={92}
          priority={activeIndex === 0}
          className={`
            object-contain
            transition-transform duration-500 ease-out
            will-change-transform
          `}
          style={{
            transform: isZoomed ? "scale(2.4)" : "scale(1)",
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />

        {/* Subtle zoom overlay hint (like many modern sites) */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors pointer-events-none flex items-center justify-center">
          <span className="hidden md:inline-block bg-black/65 text-white text-xs px-4 py-2 rounded-full opacity-0 hover:opacity-90 transition-opacity">
            Hover to zoom
          </span>
        </div>
      </div>

      {/* THUMBNAILS – Daraz style: small, tight row */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-2.5 max-w-[480px] lg:max-w-[500px] mx-auto lg:mx-0">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => {
                setActiveIndex(index)
                setIsZoomed(false)
              }}
              aria-label={`Image ${index + 1} of ${images.length}`}
              className={`
                relative aspect-square rounded-lg overflow-hidden 
                transition-all duration-200
                border-2 border-transparent
                ${activeIndex === index
                  ? "border-indigo-600 shadow-sm scale-[1.04]"
                  : "hover:border-indigo-300 hover:shadow hover:scale-[1.02]"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              `}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 640px) 18vw, 85px"
                quality={80}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}