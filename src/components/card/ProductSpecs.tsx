// app/products/[id]/ProductSpecs.tsx
"use client";

interface ProductSpecsProps {
  specs: Record<string, any>; // e.g. { "Brand": "Samsung", "RAM": "8GB", "Storage": "256GB" }
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const formatKey = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  return (
    <section className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5">
        <h2 className="text-2xl font-bold">Technical Specifications</h2>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-4 transition"
            >
              <span className="font-medium text-gray-600 text-lg">
                {formatKey(key)}
              </span>
              <span className="text-gray-900 font-semibold text-right max-w-xs break-words">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}