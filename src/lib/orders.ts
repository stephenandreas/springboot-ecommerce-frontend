import { apiFetch } from "@/lib/api";
import type { Order, PagedResponse } from "@/types";

export interface StoreShippingInput {
  storeId: string;
  courierName: string;
  courierService: string;
}

export interface CheckoutInput {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string;
  shippingPostalCode: string;
  notes?: string;
  storeShippings: StoreShippingInput[];
}

export function checkout(input: CheckoutInput, token: string): Promise<Order> {
  return apiFetch<Order>("/orders/checkout", { method: "POST", body: input, token });
}

export function getMyOrders(token: string, page = 0, size = 10): Promise<PagedResponse<Order>> {
  return apiFetch<PagedResponse<Order>>(`/orders?page=${page}&size=${size}`, { token });
}

export function getOrder(id: string, token: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`, { token });
}

export function initiatePayment(orderId: string, token: string): Promise<{ amount: number; status: string }> {
  return apiFetch(`/payments/orders/${orderId}/initiate`, { method: "POST", token });
}

export function confirmReceived(orderId: string, token: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${orderId}/confirm-received`, { method: "POST", token });
}
