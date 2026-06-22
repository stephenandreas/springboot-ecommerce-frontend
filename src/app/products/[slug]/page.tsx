import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star } from "lucide-react";

import { AddToCart } from "@/components/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/products";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} di SpringCommerce`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = product.images?.[0]?.url;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
          {image ? (
            <Image src={image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tanpa gambar</div>
          )}
        </div>

        <div>
          {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
          <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            <span aria-label={`${product.rating ?? 0} dari 5`}>{(product.rating ?? 0).toFixed(1)}</span>
            <span aria-hidden>·</span>
            <span>{product.reviewCount ?? 0} ulasan</span>
          </div>

          <div className="mt-5">
            <AddToCart product={product} />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <section className="max-w-3xl">
        <h2 className="mb-3 text-lg font-semibold">Deskripsi</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {product.description?.trim() || "Penjual belum menambahkan deskripsi untuk produk ini."}
        </p>
      </section>
    </div>
  );
}
