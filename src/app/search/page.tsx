import { Search as SearchIcon } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { searchProducts } from "@/lib/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const page = query ? await searchProducts(query) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-semibold">
        {query ? (
          <>
            Hasil untuk “{query}”{" "}
            <span className="text-base font-normal text-muted-foreground">({page?.totalElements ?? 0})</span>
          </>
        ) : (
          "Cari produk"
        )}
      </h1>

      <div className="mt-6">
        {!query ? (
          <EmptyState icon={SearchIcon} title="Ketik sesuatu untuk mencari" description="Gunakan kolom pencarian di atas." />
        ) : page && page.content.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {page.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon={SearchIcon} title="Tidak ada hasil" description={`Tidak ada produk yang cocok dengan “${query}”.`} />
        )}
      </div>
    </div>
  );
}
