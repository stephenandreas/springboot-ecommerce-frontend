import { apiFetch } from "@/lib/api";
import type { PagedResponse, Product } from "@/types";

export interface ProductQuery {
  page?: number;
  size?: number;
}

/** Public, cacheable product listing. Returns an empty page if the backend is unreachable. */
export async function getProducts(query: ProductQuery = {}): Promise<PagedResponse<Product>> {
  const params = new URLSearchParams({
    page: String(query.page ?? 0),
    size: String(query.size ?? 20),
  });
  try {
    return await apiFetch<PagedResponse<Product>>(`/products?${params.toString()}`);
  } catch {
    return { content: [], page: 0, size: query.size ?? 20, totalElements: 0, totalPages: 0, last: true };
  }
}

/** Single product by slug. Returns null on 404 / unreachable backend (page renders notFound). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function searchProducts(q: string, page = 0, size = 20): Promise<PagedResponse<Product>> {
  const params = new URLSearchParams({ q, page: String(page), size: String(size) });
  try {
    return await apiFetch<PagedResponse<Product>>(`/products/search?${params.toString()}`);
  } catch {
    return { content: [], page: 0, size, totalElements: 0, totalPages: 0, last: true };
  }
}

export async function getProductsByCategory(slug: string, page = 0, size = 20): Promise<PagedResponse<Product>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  try {
    return await apiFetch<PagedResponse<Product>>(`/categories/${encodeURIComponent(slug)}/products?${params.toString()}`);
  } catch {
    return { content: [], page: 0, size, totalElements: 0, totalPages: 0, last: true };
  }
}
