import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Store as StoreIcon, MapPin, Package, Users } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { StarRating } from "@/components/star-rating";
import { FollowButton } from "@/components/follow-button";
import { Stagger, StaggerItem } from "@/components/motion";
import { getStoreBySlug, getStoreProducts } from "@/lib/stores";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: "Toko tidak ditemukan" };
  return { title: store.name, description: store.description ?? `Toko ${store.name} di SpringCommerce` };
}

export default async function StorePage({ params }: Params) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const products = (await getStoreProducts(store.id)).content;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-muted md:h-56">
        {store.bannerUrl && <Image src={store.bannerUrl} alt="" fill sizes="100vw" className="object-cover" priority />}
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Store header */}
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-background ring-4 ring-background md:size-24">
              {store.logoUrl ? (
                <Image src={store.logoUrl} alt={store.name} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="brand-gradient grid h-full place-items-center text-background">
                  <StoreIcon className="size-8" />
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-black uppercase tracking-tight">{store.name}</h1>
              {(store.city || store.province) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {[store.city, store.province].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
          <div className="pb-1">
            <FollowButton storeId={store.id} slug={store.slug} initialCount={store.followerCount} />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={Users} label="Pengikut" value={String(store.followerCount)} />
          <Stat icon={Package} label="Produk" value={String(store.productCount ?? products.length)} />
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 py-4">
            <StarRating value={Number(store.ratingAvg ?? 0)} count={store.reviewCount ?? 0} size="md" />
            <span className="mt-1 text-xs text-muted-foreground">Rating</span>
          </div>
        </div>

        {store.description && (
          <p className="mt-6 max-w-2xl whitespace-pre-line text-sm text-muted-foreground">{store.description}</p>
        )}

        {/* Products */}
        <section className="mt-10 pb-4">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-tight">Produk Toko</h2>
          {products.length === 0 ? (
            <EmptyState title="Belum ada produk" description="Toko ini belum memiliki produk aktif." />
          ) : (
            <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} storeName={store.name} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/50 py-4">
      <Icon className="size-5 text-muted-foreground" />
      <span className="mt-1 text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
