import Image from "next/image";

export default function FeaturedProducts({ limit = 8 }) {
  // Replace with real data fetching
  const products = [...Array(limit)].map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 89.99,
    image: "/placeholder.jpg",
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
              Quick Add
            </button>
          </div>
          <div className="mt-4 text-center">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-lg font-semibold">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}