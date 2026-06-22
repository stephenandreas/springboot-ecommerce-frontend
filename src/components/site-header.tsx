"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Store, User, LogOut, LayoutDashboard, Package, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function SiteHeader() {
  const { token, email, role, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b bg-muted/40 md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground">
          <span>Marketplace ditenagai Spring Boot</span>
          <nav className="flex items-center gap-4">
            <Link href="/seller" className="hover:text-foreground">Jadi Penjual</Link>
            <Link href="/orders" className="hover:text-foreground">Lacak Pesanan</Link>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
              <HelpCircle className="size-3.5" /> Bantuan
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="brand-gradient grid size-8 place-items-center rounded-lg text-white">
            <Store className="size-4" />
          </span>
          <span className="hidden text-lg sm:inline">SpringCommerce</span>
        </Link>

        <form onSubmit={onSearch} className="relative flex-1 md:mx-2" role="search">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            name="q"
            placeholder="Cari produk, merek, atau toko…"
            className="h-10 rounded-full border-2 pl-10 focus-visible:border-primary"
            aria-label="Cari produk"
          />
        </form>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative" render={<Link href="/cart" />}>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px] tabular-nums">
                {count > 9 ? "9+" : count}
              </Badge>
            )}
          </Button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Akun" />}>
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  Masuk sebagai<br />
                  <span className="text-sm font-medium text-foreground">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/orders" />}>
                  <Package className="size-4" /> Pesanan Saya
                </DropdownMenuItem>
                {(role === "ROLE_SELLER" || role === "ROLE_ADMIN") && (
                  <DropdownMenuItem render={<Link href="/seller" />}>
                    <LayoutDashboard className="size-4" /> Dashboard Penjual
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex" render={<Link href="/login" />}>
              Masuk
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
