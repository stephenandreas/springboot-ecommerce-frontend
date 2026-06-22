import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Store as StoreIcon, ShieldCheck, Truck, ChevronRight } from "lucide-react";

import { AddToCart } from "@/components/add-to-cart";
import { ImageGallery } from "@/components/image-gallery";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug, getProducts } from "@/lib/products";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return { title: product.name, description: product.description ?? `${product.name} di SpringCommerce` };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts({ size: 12 })).content.filter((p) => p.id !== product.id).slice(0, 5);
  const images = (product.images ?? []).map((i) => i.url).filter(Boolean);
  const attributes = product.attributes ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,45%)_1fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <ImageGallery images={images} alt={product.name} />
        </div>

        <div className="space-y-4">
          <div>
            {product.brand && <Badge variant="secondary" className="mb-2">{product.brand}</Badge>}
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StarRating value={product.rating ?? 0} count={product.reviewCount ?? 0} size="md" />
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">{product.reviewCount ?? 0} ulasan</span>
            </div>
          </div>

          <AddToCart product={product} />

          {/* Store card */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <span className="brand-gradient grid size-12 place-items-center rounded-full text-white">
              <StoreIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Toko Resmi</p>
              <p className="text-xs text-muted-foreground">Penjual terverifikasi</p>
            </div>
            <Button variant="outline" size="sm">Kunjungi</Button>
          </div>

          {/* Assurance */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Truck className="size-4 text-primary" /> <span>Gratis ongkir tersedia</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <ShieldCheck className="size-4 text-primary" /> <span>Jaminan 100% original</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail tabs */}
      <div className="mt-8">
        <Tabs defaultValue="desc">
          <TabsList>
            <TabsTrigger value="desc">Deskripsi</TabsTrigger>
            <TabsTrigger value="spec">Spesifikasi</TabsTrigger>
            <TabsTrigger value="review">Ulasan ({product.reviewCount ?? 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="desc" className="max-w-3xl pt-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description?.trim() || "Penjual belum menambahkan deskripsi untuk produk ini."}
            </p>
          </TabsContent>
          <TabsContent value="spec" className="pt-4">
            {Object.keys(attributes).length ? (
              <dl className="max-w-lg divide-y rounded-lg border">
                {Object.entries(attributes).map(([k, v]) => (
                  <div key={k} className="flex gap-4 px-4 py-2.5 text-sm">
                    <dt className="w-40 shrink-0 capitalize text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada spesifikasi.</p>
            )}
          </TabsContent>
          <TabsContent value="review" className="pt-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{(product.rating ?? 0).toFixed(1)}</span>
              <div>
                <StarRating value={product.rating ?? 0} showValue={false} size="md" />
                <p className="text-xs text-muted-foreground">{product.reviewCount ?? 0} ulasan</p>
              </div>
            </div>
            {(product.reviewCount ?? 0) === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">Belum ada ulasan. Jadilah yang pertama setelah membeli.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="Produk Terkait" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
