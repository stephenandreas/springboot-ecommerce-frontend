import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("buyer@test.com");
  await page.getByLabel("Password").fill("Passw0rd1");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL("/");
}

test.describe("Browsing (publik, server-rendered)", () => {
  test("home menampilkan hero + produk", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Gaya baru/i);
    await expect(page.getByText("Kaos E2E Premium").first()).toBeVisible();
  });

  test("pencarian menampilkan hasil", async ({ page }) => {
    await page.goto("/search?q=kaos");
    await expect(page.getByRole("heading")).toContainText(/kaos/i);
    await expect(page.getByText("Kaos E2E Premium").first()).toBeVisible();
  });

  test("flash sale tampil dengan badge diskon", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Flash Sale" })).toBeVisible();
    await expect(page.getByText("Flash Deal E2E").first()).toBeVisible();
    await expect(page.getByText("-40%").first()).toBeVisible();
  });

  test("detail produk menampilkan harga + CTA", async ({ page }) => {
    await page.goto("/products/kaos-e2e-premium");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kaos E2E Premium");
    await expect(page.getByText(/150\.000/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Beli Sekarang" })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Deskripsi/ })).toBeVisible();
  });
});

test.describe("Keranjang & checkout", () => {
  test("tambah ke keranjang lalu tampil di halaman keranjang", async ({ page }) => {
    await page.goto("/products/kaos-e2e-premium");
    await page.getByRole("button", { name: /Tambah ke Keranjang/i }).click();
    await page.goto("/cart");
    await expect(page.getByText("Kaos E2E Premium").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
  });

  test("checkout meminta login dulu", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login/);
  });

  test("alur checkout penuh setelah login membuat pesanan", async ({ page }) => {
    await page.goto("/products/kaos-e2e-premium");
    await page.getByRole("button", { name: /Tambah ke Keranjang/i }).click();
    await login(page);
    await page.goto("/checkout");
    await page.getByLabel("Nama penerima").fill("Buyer");
    await page.getByLabel("No. telepon").fill("08123456789");
    await page.getByLabel("Alamat lengkap").fill("Jl. Uji 1");
    await page.getByLabel("Kota").fill("Jakarta");
    await page.getByLabel("Kode pos").fill("12345");
    await page.getByRole("button", { name: /Buat Pesanan/i }).click();
    await expect(page).toHaveURL(/\/orders\/order-1/);
    await expect(page.getByText(/Detail Pesanan/i)).toBeVisible();
  });
});

test.describe("Autentikasi & area terproteksi", () => {
  test("login lalu menu akun muncul", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Akun" }).click();
    await expect(page.getByText("buyer@test.com")).toBeVisible();
  });

  test("registrasi memvalidasi input", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: "Daftar" }).click();
    await expect(page.getByText(/minimal 2 karakter/i)).toBeVisible();
  });

  test("pesanan butuh login lalu menampilkan daftar", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/login/);
    await login(page);
    await page.goto("/orders");
    await expect(page.getByText("Pesanan Saya")).toBeVisible();
  });

  test("dashboard penjual diproteksi", async ({ page }) => {
    await page.goto("/seller");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Responsif", () => {
  test("navigasi bawah mobile tampil di beranda", async ({ page, isMobile }) => {
    test.skip(!isMobile, "khusus viewport mobile");
    await page.goto("/");
    await expect(page.getByRole("navigation").getByText("Beranda")).toBeVisible();
  });
});
