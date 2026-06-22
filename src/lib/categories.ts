import { apiFetch } from "@/lib/api";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    return await apiFetch<Category[]>("/categories");
  } catch {
    return [];
  }
}

export async function getCategoryTree(): Promise<Category[]> {
  try {
    return await apiFetch<Category[]>("/categories/tree");
  } catch {
    return [];
  }
}
