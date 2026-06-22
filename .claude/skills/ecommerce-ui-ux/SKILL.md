---
name: ecommerce-ui-ux
description: UI/UX patterns and design system for the springboot-ecommerce multi-seller marketplace frontend (shadcn/ui + Tailwind). Use when designing pages, components, or flows.
---

# Marketplace UI/UX (multi-seller, Shopee/Tokopedia-style)

This frontend serves three personas backed by the springboot-ecommerce roles: **buyer (CUSTOMER)**, **seller (SELLER)**, **admin (ADMIN)**. Design for buyers first; sellers/admin get focused dashboards.

## Design system

- Built on **shadcn/ui + Tailwind v4**. Use design tokens (CSS vars from `globals.css`) — never hard-code hex. Respect dark mode (`.dark`).
- Brand accent: a single primary color used sparingly for CTAs (Add to cart, Checkout, Pay). Keep most surfaces neutral so product imagery leads.
- Spacing: 4px grid. Cards `rounded-xl`, subtle `border` + `shadow-sm`, hover lift on interactive cards.
- Typography: clear hierarchy — product name `font-medium`, price prominent (`text-lg font-semibold`), secondary meta muted (`text-muted-foreground text-sm`).
- Currency: always IDR via `Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0})`. Indonesian UI copy.

## Core patterns

- **ProductCard**: square image (`next/image`, `aspect-square`, `object-cover`), name (2-line clamp), price, store name + rating stars, optional discount badge. Whole card is a link; "Add to cart" is a secondary action that stops propagation. Skeleton variant for loading.
- **Product grid**: responsive `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`. Never a single column on mobile for listings.
- **Listing/search**: sticky filter bar (category, price range, sort), result count, pagination or infinite scroll. Empty state with illustration + suggestion.
- **Product detail**: image gallery left, buy box right (SKU/variant selector, qty stepper, stock, Add to cart + Buy now), seller card, then description, specs, reviews with rating breakdown. Sticky buy bar on mobile.
- **Cart**: grouped **per store** (matches backend sub-orders), per-item select checkbox, qty stepper, per-store subtotal, courier select per store, sticky summary footer with grand total + Checkout. Shipping fee is computed by the backend at checkout — don't fake it client-side.
- **Checkout**: address → per-store shipping (courier) → payment method → review. Show order total breakdown (subtotal + shipping per store). After "Pay", poll `GET /payments/orders/{id}` or order status for PAID.
- **Order tracking**: a stepper reflecting PAID → PROCESSING → SHIPPED → DELIVERED/COMPLETED, with the seller-accept and buyer-confirm actions surfaced at the right step. Show the auto-cancel/auto-complete deadlines as countdowns.
- **Seller dashboard** `(seller)`: orders to process (accept/reject/ship), product CRUD, inventory low-stock alerts, balance + withdrawals, analytics. Data-dense tables, status badges.

## Status → color mapping (use Badge variants)

- PENDING / PENDING_PAYMENT → muted/secondary
- PAID / PROCESSING → blue/info
- SHIPPED → indigo
- DELIVERED / COMPLETED → green/success
- CANCELLED / EXPIRED / FAILED → destructive

## Quality bar (non-negotiable)

- **Accessibility**: semantic landmarks, keyboard-navigable menus/dialogs (shadcn handles focus traps — keep them), `alt` on every product image, visible focus rings, color contrast AA. Star ratings have an accessible label ("4.5 dari 5").
- **Loading**: every async surface has a skeleton, not a spinner-only blank. Use `loading.tsx` per route segment.
- **Empty / error states**: every list and fetch has a designed empty state and an `error.tsx` with a retry.
- **Optimistic UI** for cart add/qty with rollback on failure (toast via `sonner`).
- **Responsive**: mobile-first; test 360px, 768px, 1280px. Bottom nav or sticky CTAs on mobile.
- **Perf**: `next/image` everywhere, lazy-load below-the-fold, avoid client components for static content.

See [nextjs-frontend] for the API contract and code conventions.
