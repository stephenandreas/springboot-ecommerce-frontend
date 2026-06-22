import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  size = "sm",
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round((value ?? 0) * 2) / 2;
  const star = size === "md" ? "size-4" : "size-3.5";

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)} aria-label={`${value?.toFixed(1) ?? 0} dari 5`}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <span key={i} className="relative">
              <Star className={cn(star, "text-muted-foreground/30")} />
              {(filled || half) && (
                <Star
                  className={cn(star, "absolute inset-0 fill-rating text-rating", half && "[clip-path:inset(0_50%_0_0)]")}
                />
              )}
            </span>
          );
        })}
      </div>
      {showValue && <span className="font-medium text-foreground">{(value ?? 0).toFixed(1)}</span>}
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </div>
  );
}
