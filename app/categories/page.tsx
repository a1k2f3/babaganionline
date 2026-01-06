// app/page.tsx or pages/index.tsx
// import CategoriesSection from '@/components/sard/CategoriesSection';

import CategoriesSection from "@/components/card/CategorySection";

export default function Home() {
  return (
    <main>
      {/* Your hero section */}
      <CategoriesSection />
      {/* Other sections */}
    </main>
  );
}