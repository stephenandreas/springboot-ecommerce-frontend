import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  original,
  size = "md",
  className,
}: {
  price: number;
  original?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasDiscount = original != null && original > price;
  const pct = hasDiscount ? Math.round(((original! - price) / original!) * 100) : 0;
  const priceCls = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-bold text-primary", priceCls)}>{formatIDR(price)}</span>
      {hasDiscount && (
        <span className="flex items-center gap-1">
          <span className="rounded bg-sale/10 px-1 text-[10px] font-bold text-sale">-{pct}%</span>
          <span className="text-xs text-muted-foreground line-through">{formatIDR(original!)}</span>
        </span>
      )}
    </div>
  );
}
