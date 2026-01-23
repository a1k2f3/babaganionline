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

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ── MAIN IMAGE ──────────────────────────────────────────────── */}
      <div
        className={`
          relative 
          aspect-[4/4] md:aspect-[5/4] lg:aspect-square 
          rounded-2xl md:rounded-3xl 
          overflow-hidden 
          bg-gray-50 
          shadow-xl 
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
          // ── Critical for responsive & correct srcset generation ──
          sizes={`
            (max-width: 540px) 90vw,
            (max-width: 768px) 80vw,
            (max-width: 1024px) 60vw,
            (max-width: 1280px) 50vw,
            45vw
          `}
          // ── Quality settings for HD/sharp look ────────────────────
          quality={92}           // 90–95 is sweet spot for product photos (sharp but not 3MB+)
          priority={activeIndex === 0}  // Only first image gets priority
          // ── Improves perceived sharpness during zoom ──────────────
          className={`
            object-contain           // ← changed: better for product photos (no forced crop)
            transition-transform duration-300 ease-out
            will-change-transform
            backface-hidden
          `}
          style={{
            transform: isZoomed ? "scale(2.2)" : "scale(1)",   // 2.2–2.5 feels natural
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />

        {/* Zoom hint (desktop only) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs md:text-sm px-4 py-2 rounded-full opacity-0 md:opacity-80 pointer-events-none transition-opacity duration-300">
          Hover to zoom • Drag to explore
        </div>
      </div>

      {/* ── THUMBNAILS ──────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => {
                setActiveIndex(index)
                setIsZoomed(false)
              }}
              aria-label={`Select image ${index + 1} of ${images.length}`}
              className={`
                relative aspect-square rounded-xl overflow-hidden 
                transition-all duration-300 ease-in-out
                ${activeIndex === index
                  ? "ring-3 md:ring-4 ring-indigo-600 ring-offset-2 shadow-lg scale-[1.04]"
                  : "hover:scale-105 hover:ring-2 hover:ring-indigo-400 hover:shadow-md"
                }
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500
              `}
            >
              <Image
                src={img.url}
                alt={`${productName} - thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 10vw"
                quality={80}
                className="object-cover"
              />
              {activeIndex === index && (
                <div className="absolute inset-0 bg-indigo-600/15 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}