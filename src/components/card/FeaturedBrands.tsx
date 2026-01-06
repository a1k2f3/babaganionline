import Image from "next/image";

export default function FeaturedBrands() {
  const brands = [
    { name: "Nike", logo: "/brands/nike.png" },
    { name: "Adidas", logo: "/brands/adidas.png" },
    { name: "Apple", logo: "/brands/apple.png" },
    { name: "Samsung", logo: "/brands/samsung.png" },
    { name: "Sony", logo: "/brands/sony.png" },
    { name: "Levi's", logo: "/brands/levis.png" },
    { name: "Puma", logo: "/brands/puma.png" },
    { name: "Under Armour", logo: "/brands/underarmour.png" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
      {brands.map((brand) => (
        <div key={brand.name} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center">
          <Image src={brand.logo} alt={brand.name} width={120} height={60} className="object-contain grayscale hover:grayscale-0 transition-all" />
        </div>
      ))}
    </div>
  );
}