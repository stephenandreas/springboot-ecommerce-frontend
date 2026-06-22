import { describe, it, expect } from "vitest";
import { decodeRole } from "./auth";

function makeToken(payload: object): string {
  const b64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_");
  return `header.${b64}.signature`;
}

describe("decodeRole", () => {
  it("extracts the role claim from a JWT", () => {
    expect(decodeRole(makeToken({ role: "ROLE_SELLER", sub: "a@b.com" }))).toBe("ROLE_SELLER");
    expect(decodeRole(makeToken({ role: "ROLE_CUSTOMER" }))).toBe("ROLE_CUSTOMER");
  });

  it("returns null when there is no role claim", () => {
    expect(decodeRole(makeToken({ sub: "a@b.com" }))).toBeNull();
  });

  it("returns null for a malformed token", () => {
    expect(decodeRole("not-a-jwt")).toBeNull();
    expect(decodeRole("")).toBeNull();
  });
});
