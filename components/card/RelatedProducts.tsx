// components/card/RelatedProducts.tsx
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ products }: { products: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((item) => (
        <Link
          key={item._id}
          href={`/products/${item._id}`}
          className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="p-5">
            <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition">
              {item.name}
            </h3>
            <p className="mt-3 text-lg font-bold text-indigo-600">
              {item.price.toLocaleString()} {item.currency || "RS"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}