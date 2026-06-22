"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, User, LogOut, LayoutDashboard, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="text-xl font-black uppercase tracking-tight">
          SC
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/search" className="hover:opacity-60">Baru</Link>
          <Link href="/search" className="hover:opacity-60">Pria</Link>
          <Link href="/search" className="hover:opacity-60">Wanita</Link>
          <Link href="/seller" className="hover:opacity-60">Jual</Link>
        </nav>

        <form onSubmit={onSearch} className="relative ml-auto hidden w-64 sm:block" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input name="q" placeholder="Cari" className="h-9 rounded-full border-0 bg-muted pl-9" aria-label="Cari produk" />
        </form>

        <nav className="flex items-center gap-0.5 sm:ml-0 ml-auto">
          <Button variant="ghost" size="icon" aria-label="Cari" className="sm:hidden" render={<Link href="/search" />}>
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative" render={<Link href="/cart" />}>
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground tabular-nums">
                {count > 9 ? "9" : count}
              </span>
            )}
          </Button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Akun" />}>
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">{email}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/orders" />}>
                  <Package className="size-4" /> Pesanan
                </DropdownMenuItem>
                {(role === "ROLE_SELLER" || role === "ROLE_ADMIN") && (
                  <DropdownMenuItem render={<Link href="/seller" />}>
                    <LayoutDashboard className="size-4" /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Masuk" render={<Link href="/login" />}>
              <User className="size-5" />
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
