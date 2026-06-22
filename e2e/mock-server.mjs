// Minimal stand-in for the springboot-ecommerce backend, used only by Playwright e2e.
// Serves the springcommerce /api/v1 endpoints the UI flows touch, with canned data.
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4010);
const ok = (data, message) => ({ success: true, message: message ?? null, data });

function fakeJwt(role) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "none" })}.${b64({ sub: "buyer@test.com", role })}.sig`;
}

const CATEGORIES = [
  { id: "c1", name: "Electronics", slug: "electronics", children: [] },
  { id: "c2", name: "Fashion", slug: "fashion", children: [] },
];

const SKU = { skuId: "s1", name: "Default", price: 150000, stock: 10, weight: 500 };
const PRODUCT = {
  id: "p1", storeId: "store-1", storeName: "Toko E2E", storeSlug: "toko-e2e",
  sellerId: "seller-1", categoryId: "c1",
  name: "Kaos E2E Premium", slug: "kaos-e2e-premium", description: "Produk uji e2e.",
  brand: "E2E", images: [], skus: [SKU], attributes: { Bahan: "Katun" },
  status: "ACTIVE", rating: 4.5, reviewCount: 8,
};
const STORE = {
  id: "store-1", name: "Toko E2E", slug: "toko-e2e", description: "Toko uji e2e.",
  logoUrl: null, bannerUrl: null, status: "ACTIVE", followerCount: 12,
  city: "Jakarta", province: "DKI Jakarta", ratingAvg: 4.6, reviewCount: 20,
  productCount: 2, totalSales: 50, isFollowing: false,
};
const FLASH = {
  ...PRODUCT, id: "p3", name: "Flash Deal E2E", slug: "flash-deal-e2e",
  skus: [{ skuId: "s3", name: "Default", price: 200000, stock: 10, weight: 500,
    discountPrice: 120000, discountActive: true, effectivePrice: 120000,
    discountStartsAt: "2020-01-01T00:00:00Z", discountEndsAt: "2099-01-01T00:00:00Z" }],
};
const PRODUCTS = [PRODUCT, { ...PRODUCT, id: "p2", name: "Topi E2E", slug: "topi-e2e" }, FLASH];
const paged = (content) => ok({ content, page: 0, size: content.length, totalElements: content.length, totalPages: 1, last: true });

const ORDER = {
  id: "order-1", totalAmount: 160000, status: "PENDING_PAYMENT",
  shippingName: "Buyer", shippingPhone: "0812", shippingAddress: "Jl", shippingCity: "Jakarta", shippingPostalCode: "12345",
  subOrders: [{ id: "sub-1", storeId: "store-1", subtotal: 150000, commissionAmount: 7500, sellerAmount: 142500, status: "PENDING", shippingCost: 10000, items: [{ id: "i1", productId: "p1", productName: "Kaos E2E Premium", skuId: "s1", skuName: "Default", unitPrice: 150000, quantity: 1, subtotal: 150000 }] }],
};

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname.replace(/^\/api\/v1/, "");
  const method = req.method;

  if (method === "OPTIONS") return send(res, 200, {});
  if (path === "/categories") return send(res, 200, ok(CATEGORIES));
  if (path === "/categories/tree") return send(res, 200, ok(CATEGORIES));
  if (path === "/products") return send(res, 200, paged(PRODUCTS));
  if (path === "/products/flash-sale") return send(res, 200, ok([FLASH]));
  if (path.startsWith("/products/store/")) return send(res, 200, paged(PRODUCTS));
  if (path === "/products/search") return send(res, 200, paged(PRODUCTS));
  if (path.startsWith("/products/") && path.endsWith("/products")) return send(res, 200, paged(PRODUCTS));
  if (path.startsWith("/categories/") && path.endsWith("/products")) return send(res, 200, paged(PRODUCTS));
  if (path.startsWith("/products/")) {
    const slug = path.split("/")[2];
    const p = PRODUCTS.find((x) => x.slug === slug);
    return p ? send(res, 200, ok(p)) : send(res, 404, { success: false, message: "Not found" });
  }
  if (path === "/auth/login") return send(res, 200, ok({ accessToken: fakeJwt("ROLE_CUSTOMER"), refreshToken: "r" }, "Berhasil"));
  if (path === "/auth/register") return send(res, 200, ok({ accessToken: fakeJwt("ROLE_CUSTOMER"), refreshToken: "r" }, "Berhasil"));
  if (path === "/stores/following") return send(res, 200, paged([STORE]));
  if (path.startsWith("/stores/") && path.endsWith("/follow")) return send(res, 200, ok({ following: true, followerCount: 13 }));
  if (path.startsWith("/stores/")) return send(res, 200, ok(STORE));
  if (path === "/cart/items") return send(res, 200, ok(null));
  if (path.includes("/cart/items/") && path.endsWith("/select")) return send(res, 200, ok(null));
  if (path === "/orders/checkout") return send(res, 200, ok(ORDER, "Order created"));
  if (path === "/orders") return send(res, 200, paged([{ ...ORDER, status: "PAID" }]));
  if (path.startsWith("/payments/") && path.endsWith("/initiate")) return send(res, 200, ok({ amount: 160000, status: "PENDING" }));
  if (path.startsWith("/orders/")) return send(res, 200, ok({ ...ORDER, status: "PAID" }));
  if (path.startsWith("/seller/")) return send(res, 200, ok({ balance: 142500 }));

  return send(res, 200, ok(null));
}).listen(PORT, () => console.log(`mock backend on :${PORT}`));
