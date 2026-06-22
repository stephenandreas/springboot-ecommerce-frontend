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

Before committing UI work, run `npm run build` and `npm run lint`; both must pass. See [ecommerce-ui-ux] for component/layout patterns.
