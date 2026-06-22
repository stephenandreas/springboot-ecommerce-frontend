import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  href,
  icon: Icon,
  accent,
  action,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className={cn("grid size-8 place-items-center rounded-lg", accent ? "bg-primary text-primary-foreground" : "bg-muted")}>
            <Icon className="size-4" />
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action ??
        (href && (
          <Link href={href} className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-primary hover:underline">
            Lihat semua <ChevronRight className="size-4" />
          </Link>
        ))}
    </div>
  );
}
