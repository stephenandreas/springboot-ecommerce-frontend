import { apiFetch } from "@/lib/api";
import type { PagedResponse, Store, UserProfile, ReturnRequest, Order, Voucher } from "@/types";
import type { Withdrawal, StoreVoucherInput } from "@/lib/seller";

export interface AdminAnalytics {
  totalUsers: number;
  totalStores: number;
  totalOrders: number;
  gmv: number;
  platformCommission: number;
  totalEscrow: number;
}
export function getAdminAnalytics(token: string): Promise<AdminAnalytics> {
  return apiFetch<AdminAnalytics>("/admin/analytics", { token });
}

// Users
export function getAdminUsers(token: string, page = 0, size = 30): Promise<PagedResponse<UserProfile>> {
  return apiFetch<PagedResponse<UserProfile>>(`/admin/users?page=${page}&size=${size}`, { token });
}
export const banUser = (id: string, t: string) => apiFetch<void>(`/admin/users/${id}/ban`, { method: "PUT", token: t });
export const unbanUser = (id: string, t: string) => apiFetch<void>(`/admin/users/${id}/unban`, { method: "PUT", token: t });

// Stores
export function getAdminStores(token: string, page = 0, size = 30): Promise<PagedResponse<Store>> {
  return apiFetch<PagedResponse<Store>>(`/admin/stores?page=${page}&size=${size}`, { token });
}
export const approveStore = (id: string, t: string) => apiFetch<Store>(`/stores/${id}/approve`, { method: "PUT", token: t });
export const suspendStore = (id: string, t: string) => apiFetch<void>(`/admin/stores/${id}/suspend`, { method: "PUT", token: t });
export const activateStore = (id: string, t: string) => apiFetch<void>(`/admin/stores/${id}/activate`, { method: "PUT", token: t });

// Withdrawals
export function getAdminWithdrawals(token: string, page = 0, size = 30): Promise<PagedResponse<Withdrawal>> {
  return apiFetch<PagedResponse<Withdrawal>>(`/admin/withdrawals?page=${page}&size=${size}`, { token });
}
export const approveWithdrawal = (id: string, t: string) => apiFetch<Withdrawal>(`/admin/withdrawals/${id}/approve`, { method: "PUT", token: t });
export const rejectWithdrawal = (id: string, t: string) => apiFetch<Withdrawal>(`/admin/withdrawals/${id}/reject`, { method: "PUT", token: t });

// Returns
export function getAdminReturns(token: string): Promise<ReturnRequest[]> {
  return apiFetch<ReturnRequest[]>("/admin/returns", { token });
}
export function resolveReturn(id: string, input: { status: string; refundAmount?: number; adminNotes?: string }, token: string): Promise<ReturnRequest> {
  return apiFetch<ReturnRequest>(`/admin/returns/${id}/resolve`, { method: "PUT", token, body: input });
}

// Orders
export function getAdminOrders(token: string, page = 0, size = 30): Promise<PagedResponse<Order>> {
  return apiFetch<PagedResponse<Order>>(`/admin/orders?page=${page}&size=${size}`, { token });
}

// Vouchers (platform)
export function getAdminVouchers(token: string, page = 0, size = 30): Promise<Voucher[]> {
  return apiFetch<PagedResponse<Voucher>>(`/admin/vouchers?page=${page}&size=${size}`, { token }).then((p) => p.content);
}
export function createAdminVoucher(input: StoreVoucherInput, token: string): Promise<Voucher> {
  return apiFetch<Voucher>("/admin/vouchers", { method: "POST", token, body: input });
}
export const deactivateAdminVoucher = (id: string, t: string) => apiFetch<void>(`/admin/vouchers/${id}/deactivate`, { method: "PUT", token: t });
