"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Receipt, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const TABS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Kategori", icon: LayoutGrid },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart, badge: true },
  { href: "/orders", label: "Pesanan", icon: Receipt },
  { href: "/login", label: "Akun", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname.startsWith("/seller")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur [box-shadow:0_-1px_0_var(--muted)] md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ href, label, icon: Icon, badge }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="relative">
                <Icon className="size-5" />
                {badge && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
