'use client';

import { useEffect, useState } from 'react';

interface LiveViewersProps {
  productId: string;
}

export default function LiveViewers({ productId }: LiveViewersProps) {
  const [viewerCount, setViewerCount] = useState(3); // starting number
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateViewers = async () => {
      try {
        // Call your existing API or a new simple endpoint
        const res = await fetch(`/api/products/${productId}/viewers`, {
          method: 'POST',     // Optional: to register current view
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setViewerCount(data.count || Math.floor(Math.random() * 8) + 2);
        }
      } catch (error) {
        // Fallback: fake realistic number if API fails
        setViewerCount(Math.floor(Math.random() * 7) + 2);
      }
      setIsLoading(false);
    };

    // Initial fetch
    updateViewers();

    // Poll every 8 seconds
    interval = setInterval(updateViewers, 8000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      {isLoading ? '...' : `${viewerCount} people viewing now`}
    </div>
  );
}