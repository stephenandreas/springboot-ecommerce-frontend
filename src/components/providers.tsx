"use client";

import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
