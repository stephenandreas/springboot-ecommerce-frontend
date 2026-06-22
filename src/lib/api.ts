import type { ApiResponse } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  /** Next.js fetch cache hint; defaults to a 60s revalidate for GETs. */
  revalidate?: number | false;
};

/**
 * Single entry point for talking to the springboot-ecommerce backend.
 * Prepends the base URL, attaches the bearer token, unwraps `ApiResponse.data`,
 * and throws a typed `ApiError` when `success === false` or the request fails.
 */
export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { body, token, revalidate, headers, ...rest } = opts;
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const init: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  // Caching: explicit no-store for mutations/auth'd reads, otherwise revalidate.
  const method = (rest.method ?? "GET").toUpperCase();
  if (method === "GET" && revalidate !== false) {
    (init as RequestInit & { next?: { revalidate: number } }).next = {
      revalidate: revalidate ?? 60,
    };
  } else {
    init.cache = "no-store";
  }

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server. Coba lagi.", 0);
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    // non-JSON response
  }

  if (!res.ok || !payload?.success) {
    const message =
      payload?.message ??
      (res.status === 429
        ? "Terlalu banyak percobaan. Coba lagi sebentar."
        : `Permintaan gagal (${res.status}).`);
    throw new ApiError(message, res.status);
  }

  return payload.data;
}
