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
      {/* Hero Section - Smaller & Cleaner */}
      {/* Hero Section */}
<div className="relative h-[36vh] min-h-[260px] max-h-[400px] md:h-[40vh] lg:h-[44vh] xl:h-[46vh] 2xl:max-h-[500px] overflow-hidden rounded-b-3xl">
  <HeroSection />
</div>

      {/* Categories Section */}
      <section className="py-14 md:py-18 lg:py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
          <CategoriesSection />
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-14 md:py-18 lg:py-20 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/30 dark:via-gray-900 dark:to-orange-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10 md:mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-semibold shadow-md mb-4">
              🔥 LIMITED TIME ONLY
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-red-600 dark:text-red-400">
              Flash Deals
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
              Grab these amazing offers before they disappear!
            </p>
          </div>
          <DealsSection />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-14 md:py-18 lg:py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-orange-500 text-sm font-semibold tracking-widest">HOT RIGHT NOW</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Trending Right Now
            </h2>
            <div className="h-1 w-14 bg-orange-500 mx-auto mt-4 rounded-full" />
          </div>
          <TrendingProducts />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-14 md:py-18 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              New Arrivals &amp; Browse All
            </h2>
            <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400">
              Fresh styles just landed — be the first to shop
            </p>
          </div>
          <ProductsSection />
        </div>
      </section>
    </main>
  );
}