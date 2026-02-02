// app/page.tsx

import HeroSection from '@/components/hero/Herosection';
import DealsSection from '@/components/card/DealsSection';
import CategoriesSection from '@/components/card/CategorySection';
import TrendingProducts from '@/components/card/TrendingProducts';
import ProductsSection from '@/components/featureproducts/ProductSection';

export const metadata = {
  title: "Home | Baba Gani Online",
  description:
    "Baba Gani Online: Pakistan's reliable online shopping destination. Enjoy secure checkout, fast delivery across Pakistan, easy returns, and full protection of your personal data",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 1. Hero – full-bleed feel, slightly taller on desktop */}
      <div className="relative h-[50vh] min-h-[340px] max-h-[580px] overflow-hidden md:h-[55vh] lg:h-[65vh]">
        <HeroSection />
      </div>

      {/* 2. Categories – immediately after hero, clean & inviting */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <CategoriesSection />
        </div>
      </section>

      {/* 3. Flash Deals – urgency with better contrast & spacing */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-center mb-10 md:mb-14 text-red-600 dark:text-red-400 tracking-tight">
            🔥 Flash Deals – Limited Time!
          </h2>
          <DealsSection />
        </div>
      </section>

      {/* 4. Trending – premium feel with accent color */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-center mb-10 md:mb-14 text-orange-600 dark:text-orange-400">
            Trending Right Now
          </h2>
          <TrendingProducts limit={12} />
        </div>
      </section>

      {/* 5. New Arrivals / All Products – final discovery section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-center mb-10 md:mb-14 text-gray-900 dark:text-gray-100">
            New Arrivals & Browse All
          </h2>
          <ProductsSection />
        </div>
      </section>
    </main>
  );
}