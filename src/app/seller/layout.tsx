"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList, Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Produk", icon: Package },
  { href: "/seller/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/seller/store", label: "Toko", icon: Store },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isReady && !token) router.replace("/login?next=/seller");
  }, [isReady, token, router]);

  if (!isReady || !token) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">Memuat…</div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-20 md:h-fit">
        <p className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">Penjual</p>
        <nav className="flex gap-1 md:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/seller" ? pathname === "/seller" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary/50",
                )}
              >
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
