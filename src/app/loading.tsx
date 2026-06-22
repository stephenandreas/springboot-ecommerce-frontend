import { ProductGridSkeleton } from "@/components/product-grid-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 h-40 animate-pulse rounded-2xl bg-muted" />
      <ProductGridSkeleton count={10} />
    </div>
  );
}
