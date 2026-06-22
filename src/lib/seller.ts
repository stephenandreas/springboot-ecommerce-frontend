import { apiFetch } from "@/lib/api";
import type { PagedResponse, Product, SubOrder } from "@/types";

export interface SellerBalance {
  balance?: number;
  available?: number;
  pending?: number;
}

export function getSellerBalance(token: string): Promise<SellerBalance> {
  return apiFetch<SellerBalance>("/seller/balance", { token });
}

export function getSellerProducts(token: string, page = 0, size = 50): Promise<PagedResponse<Product>> {
  return apiFetch<PagedResponse<Product>>(`/products/seller?page=${page}&size=${size}`, { token });
}

export function getSellerOrders(token: string, page = 0, size = 50): Promise<PagedResponse<SubOrder>> {
  return apiFetch<PagedResponse<SubOrder>>(`/orders/seller?page=${page}&size=${size}`, { token });
}

export function acceptSubOrder(subOrderId: string, token: string): Promise<SubOrder> {
  return apiFetch<SubOrder>(`/orders/sub-orders/${subOrderId}/accept`, { method: "POST", token });
}

export function rejectSubOrder(subOrderId: string, token: string): Promise<SubOrder> {
  return apiFetch<SubOrder>(`/orders/sub-orders/${subOrderId}/reject`, { method: "POST", token });
}

export function shipSubOrder(subOrderId: string, trackingNumber: string, token: string): Promise<SubOrder> {
  return apiFetch<SubOrder>(`/orders/sub-orders/${subOrderId}/ship`, {
    method: "PATCH",
    token,
    body: { trackingNumber },
  });
}
