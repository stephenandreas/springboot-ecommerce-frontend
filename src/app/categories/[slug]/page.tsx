import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { getProductsByCategory } from "@/lib/products";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const page = await getProductsByCategory(slug);
  const title = slug.replace(/-/g, " ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-semibold capitalize">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{page.totalElements} produk</p>

      <div className="mt-6">
        {page.content.length === 0 ? (
          <EmptyState title="Belum ada produk di kategori ini" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {page.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
