---
name: nextjs-frontend
description: How to build this Next.js 16 (App Router) + TypeScript frontend and integrate it with the springboot-ecommerce backend. Use whenever adding pages, data fetching, auth, or API calls.
---

# Next.js frontend for springboot-ecommerce

Stack: **Next.js 16 (App Router, src/ dir)**, React 19, TypeScript, Tailwind v4, shadcn/ui. Package manager: npm. Node: 24 LTS (via nvm — prefix `PATH="$HOME/.nvm/versions/node/v24.17.0/bin:$PATH"` for shell commands).

## Backend contract (springboot-ecommerce)

- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080/api/v1`).
- Every response is wrapped: `{ data: T, message: string, success: boolean, timestamp: string }`. Always unwrap `.data`.
- Auth: JWT. `POST /auth/login` and `/auth/register` return `{ data: { accessToken, refreshToken } }`. Send `Authorization: Bearer <token>` on protected calls. Roles: `CUSTOMER`, `SELLER`, `ADMIN` (claim `role` = `ROLE_*`).
- Login/register are **rate-limited 5/min per IP** — debounce auth submits, surface 429 as "coba lagi sebentar".
- Key endpoints: `GET /products` (paged `{content,totalElements,...}`), `GET /products/{slug}`, `GET /products/search`, `GET /categories`, `GET /categories/tree`, cart `GET/POST/PATCH/DELETE /cart...`, `POST /orders/checkout`, `GET /orders`, `POST /payments/orders/{id}/initiate`, reviews, stores, seller dashboard `GET /seller/...`. Full map in backend `docs/API.md`.
- Order flow the UI must reflect: PENDING_PAYMENT → (pay) → PAID → seller accepts → seller ships → buyer confirms → COMPLETED. Sub-order statuses: PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED.

## Conventions

- **Server Components by default.** Fetch data in async Server Components for public, cacheable content (product lists, detail, categories). Add `"use client"` only for interactivity (cart, forms, menus).
- **One API client** in `src/lib/api.ts`: a typed `apiFetch<T>(path, opts)` that prepends the base URL, attaches the bearer token, unwraps `.data`, and throws a typed `ApiError` on `!success`. Never call `fetch` to the backend directly from components.
- Types live in `src/types/`. Mirror backend DTOs (Product, ProductSku, OrderResponse, CartResponse, etc.). Keep money as `number` (backend sends BigDecimal as JSON number/string — coerce with `Number()`), format with `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
- Auth token: store the access token in an httpOnly cookie via a Route Handler / Server Action when possible; for a simpler first pass, a client `AuthProvider` (Context) holding the token in memory + `localStorage` is acceptable, but never log tokens.
- Data fetching caching: public GETs can use `fetch(url, { next: { revalidate: 60 } })`; user-specific calls use `cache: 'no-store'`.
- Use Route segments: `(shop)` for buyer pages, `(seller)` for the seller dashboard, `(auth)` for login/register. Co-locate `loading.tsx` (skeletons) and `error.tsx` per segment.
- Forms: `react-hook-form` + `zod` + shadcn `Form`. Validate client-side, but treat backend 400 (`ApiResponse.success=false`) as the source of truth and map `message` to a toast / field error.
- Env: `.env.local` (gitignored) holds `NEXT_PUBLIC_API_BASE_URL`. Commit `.env.example`.

## Commands (always prefix the nvm PATH)

```
npm run dev        # local dev
npm run build      # production build — run before pushing/PR
npm run lint
npx shadcn@latest add <component>
```

## shadcn = Radix UI — composition with `asChild`

The shadcn components here are the classic **Radix UI** variant (`radix-ui` package, `style: "new-york"` in components.json). Polymorphism uses **`asChild`** + a single child (Slot), NOT a `render` prop:

```tsx
// ✅ Radix
<Button asChild><Link href="/cart">Keranjang</Link></Button>
<DropdownMenuTrigger asChild><Button variant="ghost">…</Button></DropdownMenuTrigger>
<DropdownMenuItem asChild><Link href="/orders">Pesanan</Link></DropdownMenuItem>
```
History: the project was scaffolded with the Base UI variant (`base-nova` style, `render` prop) which had API gotchas (e.g. `DropdownMenuLabel` crashing without a `<DropdownMenuGroup>` wrapper). It was migrated to Radix — switch `components.json` `style` to `new-york`, `shadcn add --overwrite` every component, then convert `render={<X/>}` → `asChild`. Select uses `value` + `onValueChange(value: string)`. Add components with `npx shadcn@latest add <name>` (Tailwind v4).

**Always test interactive overlay components (DropdownMenu, Dialog, Sheet, Select, Tabs) with a jsdom interaction test** — Playwright can't launch a browser in this sandbox, so a render-and-open test is the only guard against "context missing"-class runtime crashes.

## Reusable UI building blocks (single source each)

Keep ONE implementation of each and reuse everywhere: `ProductCard`, `PriceTag`, `StarRating`, `SectionHeader`, `CountdownTimer`, `QuantityStepper`, `Badge` variants, `OrderStatusBadge`, `EmptyState`, skeletons. Domain components live in `src/components/`, primitives in `src/components/ui/`. Never fork a bespoke card/price/rating.

## Performance defaults

- Browsing pages (home, listing, detail, search) = Server Components → zero client JS for content. Only cart/auth/forms/menus are client.
- `next/image` with correct `sizes` everywhere; `priority` only for the LCP image. Stream slow sections with `<Suspense>` + skeleton.
- Optimistic UI for cart add/qty (rollback + toast on failure).

Before committing UI work, run `npm run build` and `npm run lint`; both must pass. See [ecommerce-ui-ux] for the full design system and page blueprints.
