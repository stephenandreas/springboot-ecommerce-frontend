import { apiFetch } from "@/lib/api";
import type { CartLine } from "@/lib/cart-context";

/**
 * Push the client-side cart into the backend cart so /orders/checkout (which operates on the
 * server cart) sees the right items, then mark them selected. Run before calling checkout().
 */
export async function syncCartToBackend(lines: CartLine[], token: string): Promise<void> {
  for (const l of lines) {
    await apiFetch("/cart/items", {
      method: "POST",
      token,
      body: { productId: l.productId, skuId: l.skuId, quantity: l.quantity },
    });
    await apiFetch(`/cart/items/${l.productId}/${l.skuId}/select`, {
      method: "PATCH",
      token,
      body: {},
    });
  }
}
