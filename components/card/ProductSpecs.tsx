// app/products/[id]/ProductSpecs.tsx
"use client";

interface ProductSpecsProps {
  specs: Record<string, unknown>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs || Object.keys(specs).length === 0) return null;

  const formatKey = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Specifications</h2>
      <div>
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {Object.entries(specs).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0"
            >
              <span className="text-sm text-slate-500">
                {formatKey(key)}
              </span>
              <span className="max-w-xs break-words text-right text-sm font-medium text-slate-900">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}