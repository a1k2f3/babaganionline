// app/page.tsx or pages/index.tsx
// import CategoriesSection from '@/components/sard/CategoriesSection';

import CategoriesSectionpage from "@/components/card/Categoreypagesection";
// import CategoriesSection from "@/components/card/Categoreypagesection";
export const metadata = {
  title: "Shop Categories | Baba Gani Online",
  description: "Explore all categories at Baba Gani Online. Shop quality products with secure checkout, fast nationwide delivery, and easy returns in Pakistan.",
};
export default function Home() {
  return (
    <main>
      {/* Your hero section */}
      {/* <CategoriesSection /> */}
      <CategoriesSectionpage/>
      {/* Other sections */}
    </main>
  );
}