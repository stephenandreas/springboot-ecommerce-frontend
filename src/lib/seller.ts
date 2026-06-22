import { apiFetch, apiUpload } from "@/lib/api";
import type { PagedResponse, Product, Store, SubOrder } from "@/types";

export interface SkuInput {
  name: string;
  price: number;
  stock: number;
  weight?: number;
  discountPrice?: number | null;
  discountStartsAt?: string | null;
  discountEndsAt?: string | null;
}
export interface ProductInput {
  name: string;
  description?: string;
  brand?: string;
  categoryId: string;
  skus: SkuInput[];
}
export interface ProductPatch {
  name?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
}
export interface SkuPatch {
  price?: number;
  stock?: number;
  discountPrice?: number | null;
  discountStartsAt?: string | null;
  discountEndsAt?: string | null;
}
export interface StoreInput {
  name: string;
  description?: string;
  originCity?: string;
  originProvince?: string;
  originAddress?: string;
}

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

// ---- Product management ----
export function createProduct(input: ProductInput, token: string): Promise<Product> {
  return apiFetch<Product>("/products", { method: "POST", token, body: input });
}
export function updateProduct(id: string, patch: ProductPatch, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { method: "PUT", token, body: patch });
}
export function deleteProduct(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/products/${id}`, { method: "DELETE", token });
}
export function publishProduct(id: string, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}/publish`, { method: "PUT", token });
}
export function unpublishProduct(id: string, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}/unpublish`, { method: "PATCH", token });
}
export function updateSku(productId: string, skuId: string, patch: SkuPatch, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${productId}/skus/${skuId}`, { method: "PUT", token, body: patch });
}

// ---- Images ----
export async function uploadImage(file: File, token: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiUpload<{ url: string; filename: string }>("/upload/image", fd, token);
  return res.url;
}
export function addProductImage(productId: string, url: string, isPrimary: boolean, token: string): Promise<Product> {
  return apiFetch<Product>(`/products/${productId}/images`, {
    method: "POST",
    token,
    body: { url, isPrimary, altText: null },
  });
}

// ---- Store management ----
export function getMyStore(token: string): Promise<Store> {
  return apiFetch<Store>("/stores/me", { token });
}
export function applyStore(input: StoreInput, token: string): Promise<Store> {
  return apiFetch<Store>("/stores/apply", { method: "POST", token, body: input });
}
export function updateStore(input: StoreInput, token: string): Promise<Store> {
  return apiFetch<Store>("/stores/me", { method: "PUT", token, body: input });
}
export function uploadStoreLogo(file: File, token: string): Promise<Store> {
  const fd = new FormData();
  fd.append("file", file);
  return apiUpload<Store>("/stores/me/logo", fd, token);
}
export function uploadStoreBanner(file: File, token: string): Promise<Store> {
  const fd = new FormData();
  fd.append("file", file);
  return apiUpload<Store>("/stores/me/banner", fd, token);
}

// ---- Finance ----
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault?: boolean;
}
export interface Withdrawal {
  id: string;
  amount: number;
  bankName?: string;
  bankAccount?: string;
  status: string;
  createdAt?: string;
}
export function requestWithdrawal(input: { amount: number; bankName: string; bankAccount: string }, token: string): Promise<Withdrawal> {
  return apiFetch<Withdrawal>("/seller/withdrawal", { method: "POST", token, body: input });
}
export function getWithdrawals(token: string): Promise<Withdrawal[]> {
  return apiFetch<Withdrawal[]>("/seller/withdrawals", { token });
}
export function getBankAccounts(token: string): Promise<BankAccount[]> {
  return apiFetch<BankAccount[]>("/seller/bank-accounts", { token });
}
export function createBankAccount(input: { bankName: string; accountNumber: string; accountHolder: string }, token: string): Promise<BankAccount> {
  return apiFetch<BankAccount>("/seller/bank-accounts", { method: "POST", token, body: input });
}
export function deleteBankAccount(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/seller/bank-accounts/${id}`, { method: "DELETE", token });
}
export function setDefaultBankAccount(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/seller/bank-accounts/${id}/default`, { method: "PUT", token });
}

// ---- Store vouchers ----
export interface StoreVoucherInput {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
}
export function getSellerVouchers(token: string): Promise<import("@/types").Voucher[]> {
  return apiFetch("/seller/vouchers", { token });
}
export function createStoreVoucher(input: StoreVoucherInput, token: string): Promise<import("@/types").Voucher> {
  return apiFetch("/seller/vouchers", { method: "POST", token, body: input });
}
export function deactivateVoucher(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/seller/vouchers/${id}/deactivate`, { method: "PUT", token });
}
