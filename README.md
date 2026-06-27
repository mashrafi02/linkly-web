# Linkly Web

The frontend for **Linkly** — a link shortener with click analytics, QR codes, password-protected links, and paid plans. Built with Next.js (App Router) and Tailwind CSS, it talks to the [linkly-api](../linkly-api) backend over a REST API.

Live areas of the app:

- **Marketing site** (`/`) — hero, features, pricing, FAQ
- **Auth** (`/login`, `/register`) — email/password auth against the API, session stored in `localStorage`
- **Dashboard** (`/dashboard`) — create/manage short links, search, copy, delete
- **Link analytics** (`/links/[id]`) — clicks over time, top countries/devices/browsers, referrers, QR code download
- **Billing** (`/billing`) — Stripe Elements checkout for Pro/Business plans, subscription status, cancellation
- **Redirect password gate** (`/r/[slug]`) — prompts for a password when a short link is protected
- `robots.txt` / `sitemap.xml` — generated via Next's metadata routes

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Compiler enabled) |
| UI library | React 19 |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme`/`@config`) |
| Charts | [Recharts](https://recharts.org) (area chart, donut chart, bar list) |
| Payments | [Stripe.js](https://stripe.com/docs/js) + `@stripe/react-stripe-js` (Stripe Elements) |
| Language | TypeScript |
| Lint/format | ESLint 9 (`eslint-config-next`), Tailwind class-order plugin |
| Font | Plus Jakarta Sans (`next/font/google`) |

There is no global state library or server-side data layer on the frontend — all API calls go through a small typed `fetch` wrapper (`src/lib/api.ts`), and session/auth state lives in `localStorage` (`src/lib/auth.ts`).

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Marketing landing page
│   ├── layout.tsx                # Root layout, fonts, SEO metadata
│   ├── robots.ts / sitemap.ts    # Metadata routes
│   ├── (auth)/                   # Route group: login/register, shared centered layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Route group: authenticated app shell (sidebar)
│   │   ├── dashboard/page.tsx    # Link list
│   │   ├── links/[id]/page.tsx   # Per-link analytics
│   │   └── billing/page.tsx      # Plan selection + Stripe checkout
│   └── r/[slug]/page.tsx         # Password gate for protected short links
├── components/
│   ├── layout/                   # Navbar (marketing), Sidebar (dashboard)
│   ├── ui/                       # Button, Input, Modal, Toast, UpgradeBadge
│   ├── dashboard/                 # LinkCard, Create/EditLinkModal, StatCard, EmptyState
│   ├── charts/                    # ClicksAreaChart, DonutChart, BarList, ChartTooltip
│   ├── billing/                   # Stripe PaymentForm
│   └── landing/                   # PricingSection, FaqSection
├── hooks/
│   ├── useAuth.ts                 # Reads session, redirects if logged out, exposes logout()
│   └── usePlanFeatures.ts         # Maps the current user's plan to a feature-flag object
├── lib/
│   ├── api.ts                     # Typed fetch wrapper + one method per API endpoint
│   └── auth.ts                    # localStorage session helpers + cross-tab auth-change event
└── types/index.ts                 # Shared TS types mirroring the API's response shapes
```

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (the lockfile in this repo is pnpm's; npm/yarn will also work but may produce a different lockfile)
- A running instance of [linkly-api](../linkly-api) (locally or deployed) — this app is a pure client; it does no work without the API

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the linkly-api backend, e.g. `http://localhost:4000` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this app, used in SEO metadata (OpenGraph) and the sitemap |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes (for billing) | Stripe **publishable** key — safe to expose client-side. Must match the account/keys configured on the API side |

> All `NEXT_PUBLIC_*` variables are bundled into client-side JS at build time — never put a secret in one. There are currently no server-only secrets in this app. Real values belong only in your local `.env` (already git-ignored) or your hosting provider's environment settings — never commit them.

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The marketing page works standalone; login/dashboard/billing require `NEXT_PUBLIC_API_URL` to point at a reachable linkly-api instance.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the Next.js dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build (run `build` first) |
| `pnpm lint` | ESLint |

## How auth works

There's no server-side session — `src/lib/auth.ts` stores the JWT and user object from the API in `localStorage` and dispatches a custom `auth-change` event on login/logout so other mounted components (e.g. the sidebar) stay in sync. `src/hooks/useAuth.ts` reads that state on mount and redirects to `/login` if there's no valid session; it's used to gate the entire `(dashboard)` route group.

## How billing works

`/billing` calls the API to create a Stripe subscription and get back a `clientSecret`, then mounts Stripe Elements (`@stripe/react-stripe-js`) with that secret to collect payment. On success it locally patches the cached user's `plan` so the UI (e.g. the sidebar's upgrade prompt, feature gates in `usePlanFeatures`) updates immediately, ahead of the next full session refresh.

## Deployment

This is a standard Next.js app — deploy anywhere that supports Node (Vercel, Render, etc.). Set the three `NEXT_PUBLIC_*` env vars in your hosting provider's dashboard and point `NEXT_PUBLIC_API_URL` at your deployed linkly-api instance. There's a `recommended` route for Vercel (zero-config), but no platform-specific config is checked into this repo.

## License

Private project (`"private": true` in `package.json`) — not currently licensed for reuse.
