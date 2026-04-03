import HeroSection from '@/components/hero/Herosection';
import DealsSection from '@/components/card/DealsSection';
import CategoriesSection from '@/components/card/CategorySection';
import TrendingProducts from '@/components/card/TrendingProducts';
import ProductsSection from '@/components/featureproducts/ProductSection';
import { Truck, Lock, RotateCcw, Shield } from 'lucide-react';

export const metadata = {
  title: "Home | Baba Gani Online",
  description:
    "Baba Gani Online: Pakistan's reliable online shopping destination. Enjoy secure checkout, fast delivery across Pakistan, easy returns, and full protection of your personal data",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Full Screen Hero Section */}
      <div className="relative h-screen min-h-[650px] w-full overflow-hidden">
        <HeroSection />
        
        {/* Subtle gradient overlay for better depth and text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
        
        {/* Optional bottom fade to smoothly blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-950" />
      </div>

      {/* Categories Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoriesSection />
        </div>
      </section>

      {/* Flash Deals */}
      <DealsSection />

      {/* Trending Products */}
      <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingProducts />
        </div>
      </section>

      {/* New Arrivals / Featured Products */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsSection />
        </div>
      </section>

      {/* Trust Bar */}
      <div className="py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Fast Delivery */}
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Fast Delivery</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Across Pakistan</span>
            </div>

            {/* Secure Checkout */}
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Secure Checkout</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">100% Safe</span>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950">
                <RotateCcw className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Easy Returns</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Hassle Free</span>
            </div>

            {/* Data Protection */}
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Data Protection</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Full Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
