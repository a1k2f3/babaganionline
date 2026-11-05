import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[30rem] items-center overflow-hidden bg-slate-950 sm:min-h-[34rem] lg:min-h-[38rem]">
      <Image
        src="/hero.jpg"
        alt="Shop the Baba Gani Online collection"
        fill
        priority
        quality={80}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-sm">
            Baba Gani Online
          </p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find what you need.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
            Explore products and categories at Baba Gani Online.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Explore categories
            </Link>
            <Link
              href="#featured-products"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
