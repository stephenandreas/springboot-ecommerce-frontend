"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Store, Banknote, Undo2, Ticket } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/stores", label: "Toko", icon: Store },
  { href: "/admin/withdrawals", label: "Penarikan", icon: Banknote },
  { href: "/admin/returns", label: "Retur", icon: Undo2 },
  { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, role, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!token) router.replace("/login?next=/admin");
    else if (role !== "ROLE_ADMIN") router.replace("/");
  }, [isReady, token, role, router]);

  if (!isReady || !token || role !== "ROLE_ADMIN") {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">Memuat…</div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-20 md:h-fit">
        <p className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary/50",
              )}>
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
