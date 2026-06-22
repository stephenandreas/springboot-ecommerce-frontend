import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import type { Category, Product } from "@/types";

export default async function HomePage() {
  const [page, categories] = await Promise.all([getProducts({ size: 30 }), getCategories()]);
  const products = page.content;

  return (
    <div>
      <Hero />
      <Marquee />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <Reveal>
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight">Jelajahi</h2>
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.slice(0, 8).map((c) => (
              <StaggerItem key={c.id}>
                <CategoryTile category={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section id="produk" className="mx-auto max-w-7xl px-4 py-12">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Baru</h2>
            <Link href="/search" className="flex items-center gap-1 text-sm font-medium hover:underline">
              Semua <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        {products.length === 0 ? (
          <EmptyState title="Belum ada produk" description="Pastikan backend aktif dan punya produk." />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="brand-gradient relative overflow-hidden text-white">
      <div className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">SpringCommerce</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-8xl">
            Gaya baru.
            <br />
            Setiap hari.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#produk" className="rounded-full bg-white px-7 py-3 text-sm font-medium text-foreground transition-transform hover:scale-105">
              Belanja
            </Link>
            <Link href="/search" className="rounded-full border border-white/40 px-7 py-3 text-sm font-medium transition-colors hover:bg-white/10">
              Jelajahi
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Gratis Ongkir", "100% Original", "Retur 7 Hari", "Bayar Aman"];
  return (
    <div className="bg-primary py-3 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 text-xs font-medium uppercase tracking-wide">
        {items.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden bg-muted p-5 transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <span className="text-lg font-bold uppercase tracking-tight">{category.name}</span>
      <span className="mt-1 flex items-center gap-1 text-sm">
        Belanja <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <StaggerItem key={p.id}>
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
