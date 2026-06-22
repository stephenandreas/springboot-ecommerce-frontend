---
name: ecommerce-ui-ux
description: Professional, conversion-grade UI/UX spec for the springboot-ecommerce marketplace frontend — the bar is Shopee / Tokopedia / Amazon level. Use for any page, component, layout, or visual/UX decision.
---

# Marketplace UI/UX — top-tier spec

Three personas (backend roles): **buyer (CUSTOMER)**, **seller (SELLER)**, **admin (ADMIN)**. Buyers first. The look must feel like a leading marketplace — dense but clean, fast, image-led, conversion-focused. "Good enough" is not the bar; match Shopee/Tokopedia/Amazon polish.

## 1. Design language

- **Brand color**: vibrant marketplace orange/coral as `--primary` (energetic commerce signal). Used ONLY for primary CTAs (Add to cart, Buy, Checkout, Pay), active states, price emphasis, and the sale/flash accent. Everything else stays neutral so product imagery and the orange CTA pop. Never flood the page with brand color.
- **Semantic tokens** (define in `globals.css`, never hard-code hex): `--primary` (brand), `--sale`/`--price` (red-orange for discounts), `--success` (green: in-stock/completed), `--warning` (amber: low-stock/pending), `--rating` (amber star). Provide light + dark values.
- **Surfaces**: page bg slightly off-white (`--muted/30`) so white cards lift. Cards: `rounded-xl`, hairline `border`/`ring-1 ring-foreground/8`, `shadow-sm`, hover → `shadow-md` + `-translate-y-0.5` (150ms ease). Interactive cards lift; static ones don't.
- **Density & rhythm**: 4px grid. Tight, information-rich like real marketplaces — small gaps (gap-2/3/4), compact paddings. Avoid airy SaaS spacing on listings.
- **Type scale**: product name `text-sm font-medium` (2-line clamp); price `text-base/lg font-bold` in brand color; original price `line-through text-xs text-muted-foreground`; meta `text-xs text-muted-foreground`. Headings `font-semibold tracking-tight`.
- **Currency**: IDR, `Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})`. Indonesian copy throughout.
- **Imagery**: `next/image` always, `aspect-square object-cover`, blurred/neutral placeholder, never layout shift. Lazy-load below the fold; `priority` only for LCP (hero, product-detail main image).

## 2. Motion & micro-interactions (this is what separates "basic" from "pro")

- Card hover: image `scale-105` (300ms), card lift, quick-action buttons fade in.
- Buttons: subtle press (`active:translate-y-px`), loading spinners inline, never a dead click.
- Add-to-cart: optimistic update + `sonner` toast with product thumbnail; cart badge bumps (scale pulse).
- Skeletons (not spinners) for every async surface, shaped like the real content. Stagger-fade content in.
- Page/section reveals: gentle fade/slide via `tw-animate-css` (`animate-in fade-in slide-in-from-bottom-2`). Respect `prefers-reduced-motion`.
- Sticky elements: header on scroll, buy box on desktop detail, CTA bar on mobile detail, cart summary.

## 3. Component anatomy (build these as reusable pieces)

- **ProductCard** (the workhorse — make it excellent): square image; discount `-NN%` badge top-left (brand); wishlist heart top-right (appears on hover); 2-line name; price block (brand price + optional strikethrough original); rating stars + sold count; store/location row with small icon. Whole card links to detail; "Add to cart" / quick-view appear on hover (desktop) and stop propagation. Skeleton variant required.
- **PriceTag**: handles current/original/discount %, sizes (sm/md/lg), brand-colored.
- **StarRating**: filled/half/empty stars + numeric + accessible label ("4.5 dari 5"). Optional count.
- **Badge system**: Sale (-%), Flash Sale, Terlaris/Best Seller, Gratis Ongkir, Stok habis, Pre-order — consistent shapes/colors.
- **SectionHeader**: title + optional "Lihat semua" link + optional icon; used to structure the home page into scannable rows.
- **CountdownTimer**: HH:MM:SS for flash sales, ticking, accessible.
- **QuantityStepper, VariantSelector** (chips/swatches with disabled out-of-stock), **Breadcrumbs**, **EmptyState**, **OrderStatusBadge/Stepper**.

## 4. Page blueprints

- **Header**: (1) thin top utility bar (Jadi Penjual · Bantuan · Lacak Pesanan · Download App); (2) main bar: logo + prominent search (with category scope + recent/popular suggestions) + cart (badge) + account menu; (3) horizontal category nav strip. Sticky on scroll, condensing.
- **Home**: hero banner/carousel + side promo tiles; category showcase (icon tiles grid); **Flash Sale** row (countdown + horizontally scrollable cards + progress "Terjual NN%"); curated rows ("Untukmu", "Terlaris", "Produk Terbaru") each a SectionHeader + grid/scroller; trust/benefits strip (Gratis Ongkir, Bayar di Tempat, 100% Original).
- **Listing / search**: sticky filter sidebar (desktop) / filter sheet (mobile) — category, price range, rating, location, sort (Terkait/Terbaru/Terlaris/Harga). Result count, active-filter chips, responsive grid (2 cols mobile → 5 xl), pagination or infinite scroll. Designed empty state.
- **Product detail**: breadcrumbs; left = image gallery (main + thumbnail strip, zoom on hover); right = buy box (title, rating·sold, big price block, variant swatches, qty stepper, stock, **Add to cart + Beli Sekarang**, sticky on desktop); store card (logo, name, rating, chat/follow); shipping estimate row; tabs/sections (Deskripsi, Spesifikasi, Ulasan with rating breakdown + photos), then **Produk Terkait**. Mobile: sticky bottom CTA bar (Chat · Keranjang · Beli).
- **Cart**: grouped per store (= backend sub-orders), select-all + per-item checkbox, qty stepper, remove, per-store subtotal + courier note, sticky summary footer (selected total + Checkout). Shipping computed server-side at checkout — never fake it.
- **Checkout**: stepped — Alamat → Pengiriman per toko (courier) → Pembayaran → Ringkasan. Clear per-store breakdown (subtotal + ongkir), grand total, single primary CTA. After Pay, poll order status to PAID.
- **Orders**: list with status badges + thumbnails; detail with a **status stepper** (Dibayar → Diproses → Dikirim → Selesai) and the right action surfaced per step (Bayar / Konfirmasi Diterima), tracking number, auto-cancel/auto-complete countdowns.
- **Seller dashboard** `(seller)`: stat cards (saldo, pesanan baru, produk, rating), orders-to-process table with inline accept/reject/ship, product management, low-stock alerts, balance/withdrawal. Data-dense, status-badge driven.
- **Mobile**: bottom tab bar (Beranda · Kategori · Keranjang · Pesanan · Akun) on buyer pages; sticky CTAs; thumb-reachable actions.

## 5. Non-negotiable quality bar

- **Accessibility (WCAG AA)**: semantic landmarks, keyboard-navigable menus/dialogs/carousels (Base UI handles focus traps — keep them), visible focus rings, `alt` on every product image, accessible names on icon buttons, AA contrast (verify brand-on-white & on-dark), rating/price have screen-reader labels.
- **Performance / Core Web Vitals**: Server Components for all static/public content (home, listing, detail) → no client JS for browsing; `next/image` + correct `sizes`; stream with Suspense + skeletons; no CLS; prefetch links; minimize client bundles.
- **States**: every surface has loading (skeleton), empty (designed, with a next action), and error (retry) states. No raw spinners on blank pages, no dead ends.
- **Resilience**: backend may return sparse data (missing images, no discount/sold). Components must look intentional when fields are absent — show what exists, hide what doesn't, never render "undefined" or broken layout. Don't fabricate data.
- **Responsive**: mobile-first; verify 360 / 768 / 1280. Never a single-column product list on mobile.
- **Consistency**: one ProductCard, one PriceTag, one StarRating used everywhere. No bespoke one-offs.

See [nextjs-frontend] for the API contract, data fetching, and code conventions (Next.js 16 + Base UI `render` prop, not `asChild`).
