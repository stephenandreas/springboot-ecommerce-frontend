"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Store, User, LogOut, LayoutDashboard } from "lucide-react";

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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <Store className="size-5 text-primary" aria-hidden />
          <span className="hidden sm:inline">SpringCommerce</span>
        </Link>

        <form onSubmit={onSearch} className="relative flex-1" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input name="q" placeholder="Cari produk, merek, atau toko" className="pl-9" aria-label="Cari produk" />
        </form>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative" render={<Link href="/cart" />}>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                {count > 9 ? "9+" : count}
              </Badge>
            )}
          </Button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Akun" />}>
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/orders" />}>Pesanan Saya</DropdownMenuItem>
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
            <Button size="sm" render={<Link href="/login" />}>
              Masuk
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
