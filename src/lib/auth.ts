import { apiFetch } from "@/lib/api";
import type { AuthTokens, Role } from "@/types";

export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput extends LoginInput {
  fullName: string;
}

export function login(input: LoginInput): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/login", { method: "POST", body: input });
}

export function register(input: RegisterInput): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/register", { method: "POST", body: input });
}

/** Decode the `role` claim from a JWT without verifying it (display purposes only). */
export function decodeRole(token: string): Role | null {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return (json.role as Role) ?? null;
  } catch {
    return null;
  }
}
