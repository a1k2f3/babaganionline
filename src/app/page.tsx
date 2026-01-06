"use client";

export const dynamic = "force-dynamic";
// export const revalidate = 60;

import Slider from "@/components/card/Slider"; // Hero slider with deals
import DealsSection from "@/components/card/DealsSection"; // New: Flash sales/deals
import FeaturedBrands from "@/components/card/FeaturedBrands"; // New: Brands/vendors
import CategoriesSection from "@/components/card/Catagorysection";
import TrendingProducts from "@/components/card/TrendingProducts"; // New or rename FeaturedProducts
import ProductsSection from "@/components/card/ProductSection"; // All/New Arrivals
import TrustBadges from "@/components/card/TrustBadge";
import NewsletterSignup from "@/components/card/NewsLetterSignup";


export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Hero Slider - Big promotions & deals */}
      <section className="relative">
        <Slider /> {/* Make this show flash sales, categories teasers, big banners */}
      </section>

      {/* Flash Deals / Limited Time Offers */}
      <section className="py-8  text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DealsSection /> {/* Countdown timers, % off, limited stock */}
        </div>
      </section>

      {/* Featured Brands / Vendors - Hub feel */}
      

      {/* Large Categories Grid - Discovery focus */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Explore Categories
          </h2>
          <CategoriesSection /> {/* Make this a large image grid with overlays */}
        </div>
      </section>

      {/* Trending / Hot Products */}
      <section className=" w-full py-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-orange-600">
            Trending Now
          </h2>
          <TrendingProducts limit={12} /> {/* Carousel or wide grid */}
        </div>
      </section>

      {/* All Products / New Arrivals */}
      
        {/* <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8">
          */}
          <ProductsSection />
        {/* </div> */}
      

      {/* Trust & Security */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewsletterSignup />
        </div>
      </section>

     
    </main>
  );
}