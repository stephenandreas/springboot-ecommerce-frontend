import { apiFetch } from "@/lib/api";
import type { PagedResponse, Product, Store } from "@/types";

/** Public store profile by slug. Pass a token to populate `isFollowing`. Null on 404/unreachable. */
export async function getStoreBySlug(slug: string, token?: string | null): Promise<Store | null> {
  try {
    return await apiFetch<Store>(`/stores/${encodeURIComponent(slug)}`, token ? { token, revalidate: false } : {});
  } catch {
    return null;
  }
}

export async function getStoreProducts(storeId: string, page = 0, size = 20): Promise<PagedResponse<Product>> {
  try {
    return await apiFetch<PagedResponse<Product>>(`/products/store/${storeId}?page=${page}&size=${size}`);
  } catch {
    return { content: [], page: 0, size, totalElements: 0, totalPages: 0, last: true };
  }
}

export function toggleFollowStore(storeId: string, token: string): Promise<{ following: boolean; followerCount: number }> {
  return apiFetch(`/stores/${storeId}/follow`, { method: "POST", token });
}

export function getFollowedStores(token: string, page = 0, size = 20): Promise<PagedResponse<Store>> {
  return apiFetch<PagedResponse<Store>>(`/stores/following?page=${page}&size=${size}`, { token });
}
