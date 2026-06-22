# SpringCommerce Frontend

Frontend untuk marketplace multi-penjual [**springboot-ecommerce**](https://github.com/stephenandreas/springboot-ecommerce). Dibangun dengan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind v4**, dan **shadcn/ui (Base UI)**.

## Fitur

**Pembeli**
- Beranda + kategori, pencarian, halaman kategori
- Detail produk (varian SKU, qty, tambah keranjang / beli sekarang)
- Keranjang (dikelompokkan per toko, seperti sub-order backend)
- Checkout (alamat, kurir per toko — ongkir dihitung server)
- Daftar & detail pesanan (bayar, konfirmasi diterima) dengan status real-time
- Login & registrasi (JWT)

**Penjual**
- Dashboard (saldo, jumlah produk & pesanan)
- Daftar produk
- Pesanan masuk (terima / tolak / kirim resi)

## Integrasi backend

Semua data berasal dari REST API springboot-ecommerce melalui `src/lib/api.ts`:
- Membungkus `ApiResponse<T>` (`{ success, message, data }`)
- Melampirkan `Authorization: Bearer <token>`
- Menangani rate-limit 429 dan error secara konsisten

Atur base URL lewat env:

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Menjalankan

Membutuhkan **Node.js 24 LTS**.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run lint
```

Pastikan backend springboot-ecommerce berjalan di `NEXT_PUBLIC_API_BASE_URL`.

## Testing

- **Unit & integrasi** (Vitest + Testing Library, jsdom): `npm test` (atau `npm run test:cov` untuk coverage). Mencakup `lib` (api, format, auth, cart) dan komponen/halaman flow (ProductCard, PriceTag, StarRating, buy box, cart, login, register).
- **E2E / UI-UX** (Playwright, mock backend di `e2e/mock-server.mjs`): `npm run e2e`. Menguji semua flow (browsing, search, detail, keranjang, checkout, auth, pesanan, proteksi seller, responsif mobile). Di CI jalankan `npx playwright install --with-deps chromium` lebih dulu (butuh lib sistem browser).

## Struktur

```
src/
  app/            # rute App Router (shop, (auth), seller, orders, …)
  components/     # ui/ (shadcn) + komponen domain (ProductCard, dll)
  lib/            # api client, service (products/orders/seller), context (auth/cart)
  types/          # tipe yang mencerminkan DTO backend
.claude/skills/   # panduan Next.js + UI/UX khusus proyek ini
```
