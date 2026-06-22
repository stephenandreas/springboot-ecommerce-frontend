import { apiFetch } from "@/lib/api";
import type { PagedResponse, Voucher } from "@/types";

export async function listVouchers(page = 0, size = 20): Promise<Voucher[]> {
  try {
    return (await apiFetch<PagedResponse<Voucher>>(`/vouchers?page=${page}&size=${size}`)).content;
  } catch {
    return [];
  }
}

export interface VoucherCheck {
  valid: boolean;
  message?: string;
  voucher?: Voucher;
}
export function checkVoucher(code: string): Promise<VoucherCheck> {
  return apiFetch<VoucherCheck>(`/vouchers/check/${encodeURIComponent(code)}`);
}
