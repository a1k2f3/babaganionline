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
  const activeImage = images[activeIndex]

  // For zoom effect on desktop
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-5">
      {/* Main Image with Smooth Lens Zoom */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => {
          setIsZoomed(false)
          setMousePosition({ x: 50, y: 50 })
        }}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url || "/placeholder.svg"}
          alt={productName}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw"
          priority={activeIndex === 0}
          quality={75}
          className="object-contain transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: isZoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />

        {/* Zoom Hint - Only on desktop */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full opacity-0 pointer-events-none md:opacity-100 md:group-hover:opacity-100 transition-opacity">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => {
                setActiveIndex(index)
                setIsZoomed(false) // Reset zoom on change
              }}
              aria-label={`View image ${index + 1} of ${images.length}`}
              className={`
                relative aspect-square rounded-xl overflow-hidden transition-all duration-300
                ${
                  activeIndex === index
                    ? "ring-4 ring-indigo-500 ring-offset-2 shadow-lg scale-105"
                    : "hover:scale-105 hover:ring-2 hover:ring-indigo-400 hover:shadow-md"
                }
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500
              `}
            >
              <Image
                src={img.url || "/placeholder.svg"}
                alt={`${productName} - View ${index + 1}`}
                fill
                sizes="(max-width: 640px) 18vw, (max-width: 1024px) 12vw, 10vw"
                className="object-cover"
              />

              {/* Active Indicator Overlay */}
              {activeIndex === index && <div className="absolute inset-0 bg-indigo-600/20 pointer-events-none" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
