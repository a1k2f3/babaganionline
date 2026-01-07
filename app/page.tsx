// app/page.tsx  (Next.js App Router - recommended)
// OR pages/index.tsx if using Pages Router

import HeroSection from '@/components/hero/Herosection';
import DealsSection from '@/components/card/DealsSection';
import CategoriesSection from '@/components/card/CategorySection';     // Your large image grid

import TrendingProducts from '@/components/card/TrendingProducts';       // Carousel or grid
import ProductsSection from '@/components/featureproducts/ProductSection';         // All/New Arrivals

export const metadata = {
  title: "Home | Baba Gani Online",
  description:
    "Baba Gani Online: Pakistan's reliable online shopping destination. Enjoy secure checkout, fast delivery across Pakistan, easy returns, and full protection of your personal data",
};
export default function Home() {
  return (
    <main className="min-h-screen bg-white ">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Flash Deals - High urgency, right after hero */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-black">
            🔥 Flash Deals - 70% Off Limited Time!
          </h2>
          <DealsSection />
        </div>
      </section>

      {/* 3. Explore Categories - Large image grid with overlays */}
      <section className="py-12 bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Explore Categories
          </h2>
          <CategoriesSection/>
        </div>
      </section>

      {/* 4. Trending / Hot Products */}
      <section className="py-12 bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-orange-600 dark:text-orange-400">
            Trending Now
          </h2>
          {/* <TrendingProducts limit={12} /> */}
          <TrendingProducts limit={12} />
        </div>
      </section>


      {/* 6. All Products / New Arrivals - Main product browsing */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            New Arrivals & All Products
          </h2>
          <ProductsSection />
        </div>
      </section>

      
    </main>
  );
}