import { apiFetch, apiUpload } from "@/lib/api";
import type { Address, Product, UserProfile } from "@/types";

// ---- Profile ----
export function getProfile(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", { token });
}
export function updateProfile(input: { fullName?: string; phone?: string }, token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", { method: "PUT", token, body: input });
}
export function changePassword(input: { currentPassword: string; newPassword: string }, token: string): Promise<void> {
  return apiFetch<void>("/users/me/password", { method: "PUT", token, body: input });
}
export function uploadAvatar(file: File, token: string): Promise<UserProfile> {
  const fd = new FormData();
  fd.append("file", file);
  return apiUpload<UserProfile>("/users/me/avatar", fd, token);
}

// ---- Addresses ----
export interface AddressInput {
  label?: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  subdistrict?: string;
  isDefault?: boolean;
}
export function getAddresses(token: string): Promise<Address[]> {
  return apiFetch<Address[]>("/addresses", { token });
}
export function createAddress(input: AddressInput, token: string): Promise<Address> {
  return apiFetch<Address>("/addresses", { method: "POST", token, body: input });
}
export function updateAddress(id: string, input: AddressInput, token: string): Promise<Address> {
  return apiFetch<Address>(`/addresses/${id}`, { method: "PUT", token, body: input });
}
export function deleteAddress(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/addresses/${id}`, { method: "DELETE", token });
}
export function setDefaultAddress(id: string, token: string): Promise<Address> {
  return apiFetch<Address>(`/addresses/${id}/default`, { method: "PUT", token });
}

// ---- Wishlist ----
export function getWishlist(token: string): Promise<Product[]> {
  return apiFetch<Product[]>("/wishlist", { token });
}
export function toggleWishlist(productId: string, token: string): Promise<{ wishlisted?: boolean }> {
  return apiFetch(`/wishlist/${productId}`, { method: "POST", token });
}
export function removeWishlist(productId: string, token: string): Promise<void> {
  return apiFetch<void>(`/wishlist/${productId}`, { method: "DELETE", token });
}
