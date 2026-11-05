import HeroSection from '@/components/hero/Herosection';
import DealsSection from '@/components/card/DealsSection';
import CategoriesSection from '@/components/card/CategorySection';
import TrendingProducts from '@/components/card/TrendingProducts';
import ProductsSection from '@/components/featureproducts/ProductSection';
import { Truck, Lock, RotateCcw, Shield } from 'lucide-react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Shopping in Pakistan",
  description: "Browse products and categories at Baba Gani Online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Baba Gani Online | Online Shopping in Pakistan",
    description: "Browse products and categories at Baba Gani Online.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative w-full overflow-hidden">
        <HeroSection />
      </div>

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoriesSection />
        </div>
      </section>

      <DealsSection />

      <section className="border-t border-slate-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TrendingProducts />
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-16">
        <div id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsSection />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Truck className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-sm font-medium text-slate-900">Fast Delivery</span>
              <span className="text-xs text-slate-500">Across Pakistan</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Lock className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-sm font-medium text-slate-900">Secure Checkout</span>
              <span className="text-xs text-slate-500">Checkout online</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <RotateCcw className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-sm font-medium text-slate-900">Easy Returns</span>
              <span className="text-xs text-slate-500">Easy returns</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Shield className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-sm font-medium text-slate-900">Data Protection</span>
              <span className="text-xs text-slate-500">Privacy</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
