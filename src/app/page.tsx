import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default async function HomePage() {
  const [page, categories] = await Promise.all([getProducts({ size: 20 }), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
        <h1 className="max-w-2xl text-2xl font-bold tracking-tight md:text-4xl">
          Belanja dari ribuan penjual, satu marketplace.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Temukan produk terbaik dengan harga jujur — ditenagai Spring Boot di balik layar.
        </p>
      </section>

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Kategori</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c.id} href={`/categories/${c.slug}`}>
                <Badge variant="secondary" className="cursor-pointer px-3 py-1.5 text-sm hover:bg-secondary/70">
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Produk Terbaru</h2>
        {page.content.length === 0 ? (
          <EmptyState
            title="Belum ada produk"
            description="Backend belum mengembalikan produk. Pastikan API berjalan di NEXT_PUBLIC_API_BASE_URL."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {page.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
