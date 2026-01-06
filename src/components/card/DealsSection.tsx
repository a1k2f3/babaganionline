// components/card/DealsSection.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DealsSection() {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?tags=70-off`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const products = data?.data || [];

  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };
        products.forEach((product: any) => {
          const id = product._id;
          if (!updated[id]) {
            const totalSeconds = Math.floor(Math.random() * 36000) + 7200;
            updated[id] = formatTime(totalSeconds);
          } else {
            const seconds = parseTime(updated[id]) - 1;
            updated[id] = seconds <= 0 ? "00:00:00" : formatTime(seconds);
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const parseTime = (timeStr: string): number => {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium text-gray-400">
          No flash deals right now. Stay tuned! 🔥
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product: any) => {
        const originalPrice = Math.round(product.price / 0.3);
        const savings = originalPrice - product.price;

        return (
          <Link
            key={product._id}
            href={`/product/${product.slug || product._id}`}
            className="group block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Image - Square for compact feel */}
              <div className="relative aspect-square">
                <Image
                  src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  -70%
                </div>

                {/* Flash Indicator */}
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-2 h-2 bg-black rounded-full animate-ping" />
                  FLASH
                </div>
              </div>

              {/* Details */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      RS {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-2">
                      RS {originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Small Timer */}
                <div className="mt-3 bg-gray-900 text-white text-center rounded py-1.5">
                  <p className="text-xs font-mono font-bold">
                    {timeLeft[product._id] || "00:00:00"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}