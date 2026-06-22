import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "./api";

function mockFetch(response: { ok: boolean; status: number; body: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    json: async () => response.body,
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch({ ok: true, status: 200, body: { success: true, data: null } }));
});
afterEach(() => vi.unstubAllGlobals());

describe("apiFetch", () => {
  it("unwraps ApiResponse.data on success", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: true, status: 200, body: { success: true, data: { id: "p1" } } }));
    await expect(apiFetch<{ id: string }>("/products")).resolves.toEqual({ id: "p1" });
  });

  it("prepends a leading slash to the path", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: { success: true, data: 1 } });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("products");
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/v1\/products$/);
  });

  it("attaches a bearer token when provided", async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, body: { success: true, data: 1 } });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/me", { token: "abc" });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });

  it("throws ApiError with the backend message on failure", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: false, status: 400, body: { success: false, message: "Email salah" } }));
    await expect(apiFetch("/auth/login", { method: "POST" })).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Email salah",
    });
  });

  it("gives a friendly message on 429 rate limit", async () => {
    vi.stubGlobal("fetch", mockFetch({ ok: false, status: 429, body: { success: false } }));
    await expect(apiFetch("/auth/login", { method: "POST" })).rejects.toThrow(/coba lagi/i);
  });

  it("wraps network failures as ApiError status 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    await expect(apiFetch("/products")).rejects.toMatchObject({ status: 0 });
    await expect(apiFetch("/products")).rejects.toBeInstanceOf(ApiError);
  });
});
