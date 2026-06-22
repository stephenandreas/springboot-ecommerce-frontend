import Link from "next/link";
import {
  Zap,
  Sparkles,
  TrendingUp,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Tag,
  ChevronRight,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { CountdownTimer } from "@/components/countdown-timer";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import type { Category, Product } from "@/types";

export default async function HomePage() {
  const [page, categories] = await Promise.all([getProducts({ size: 30 }), getCategories()]);
  const products = page.content;
  const flash = products.slice(0, 6);
  const latest = products;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-5">
      <Hero />
      <TrustStrip />
      {categories.length > 0 && <CategoryShowcase categories={categories} />}

      {flash.length > 0 && (
        <section className="overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-foreground/8 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 font-bold text-primary-foreground">
                <Zap className="size-4 fill-current" /> Flash Sale
              </span>
              <CountdownTimer windowHours={4} />
            </div>
            <Link href="/" className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline">
              Lihat semua <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {flash.map((p) => (
              <div key={p.id} className="w-40 shrink-0 sm:w-44">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Produk Terbaru" subtitle="Baru ditambahkan para penjual" icon={Sparkles} accent href="/" />
        {latest.length === 0 ? (
          <EmptyState
            title="Belum ada produk"
            description="Pastikan backend berjalan di NEXT_PUBLIC_API_BASE_URL dan memiliki produk aktif."
          />
        ) : (
          <ProductGrid products={latest} />
        )}
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="brand-gradient relative overflow-hidden rounded-2xl p-8 text-white md:p-12">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-20 size-56 rounded-full bg-white/10" />
        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" /> Marketplace #1 ditenagai Spring Boot
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Belanja hemat dari ribuan penjual terpercaya
          </h1>
          <p className="mt-3 text-white/85">Gratis ongkir, 100% original, dan pembayaran aman.</p>
          <Link
            href="#produk"
            className="mt-6 inline-flex items-center gap-1 rounded-lg bg-white px-5 py-2.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Mulai Belanja <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="hidden flex-col gap-4 lg:flex">
        <PromoTile title="Voucher Diskon" subtitle="Hingga 50% setiap hari" icon={Tag} />
        <PromoTile title="Top-Up & Tagihan" subtitle="Cepat & otomatis" icon={Smartphone} />
      </div>
    </section>
  );
}

function PromoTile({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/8">
      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

const BENEFITS = [
  { icon: Truck, title: "Gratis Ongkir", desc: "Min. belanja tertentu" },
  { icon: ShieldCheck, title: "100% Original", desc: "Jaminan keaslian" },
  { icon: RotateCcw, title: "Mudah Retur", desc: "Garansi 7 hari" },
  { icon: Headphones, title: "Dukungan 24/7", desc: "Selalu siap membantu" },
];

function TrustStrip() {
  return (
    <section className="grid grid-cols-2 gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/8 md:grid-cols-4">
      {BENEFITS.map((b) => (
        <div key={b.title} className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <b.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{b.title}</p>
            <p className="truncate text-xs text-muted-foreground">{b.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  electronics: Smartphone,
  fashion: Shirt,
  home: HomeIcon,
};

function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section>
      <SectionHeader title="Kategori Pilihan" icon={TrendingUp} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {categories.slice(0, 16).map((c) => {
          const Icon = CATEGORY_ICONS[c.slug] ?? Tag;
          return (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl bg-card p-3 text-center ring-1 ring-foreground/8 transition-all hover:-translate-y-0.5 hover:ring-primary/40"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="line-clamp-2 text-xs font-medium">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div id="produk" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
