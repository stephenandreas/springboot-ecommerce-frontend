import { apiFetch } from "@/lib/api";
import type { PagedResponse, ProductRating, Review } from "@/types";

export function getProductReviews(productId: string, page = 0, size = 10): Promise<PagedResponse<Review>> {
  return apiFetch<PagedResponse<Review>>(`/reviews/products/${productId}?page=${page}&size=${size}`);
}

export function getProductRating(productId: string): Promise<ProductRating> {
  return apiFetch<ProductRating>(`/reviews/products/${productId}/rating`);
}

export interface CreateReviewInput {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
}
export function createReview(input: CreateReviewInput, token: string): Promise<Review> {
  return apiFetch<Review>("/reviews", { method: "POST", token, body: input });
}

export function markReviewHelpful(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/reviews/${id}/helpful`, { method: "POST", token });
}
