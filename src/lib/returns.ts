import { apiFetch } from "@/lib/api";
import type { ReturnRequest } from "@/types";

export function requestReturn(orderId: string, subOrderId: string, reason: string, token: string): Promise<ReturnRequest> {
  return apiFetch<ReturnRequest>(`/orders/${orderId}/return`, { method: "POST", token, body: { subOrderId, reason } });
}
export function getMyReturns(token: string): Promise<ReturnRequest[]> {
  return apiFetch<ReturnRequest[]>("/orders/returns/my", { token });
}
export function getSellerReturns(token: string): Promise<ReturnRequest[]> {
  return apiFetch<ReturnRequest[]>("/seller/returns", { token });
}
