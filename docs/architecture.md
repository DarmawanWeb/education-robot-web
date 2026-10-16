# Architecture

The web app is the store for Taksu's education robots and the home of every robot's learning
path. It is a Next.js app that lives at `apps/web` in the
[education-robot](https://github.com/DarmawanWeb/education-robot) workspace and reads all of its
product facts from `@taksu/catalog`.

## Stack

| Part | Choice |
|---|---|
| Framework | Next.js 16, App Router, Turbopack, `output: 'standalone'` |
| UI | React 19, Tailwind CSS 4, the theme and components from `@taksu/ui` |
| Languages | next-intl 4, `/id` (default) and `/en`, prefix always present |
| Data | `@taksu/catalog`: TypeScript objects, no database and no API |
| Fonts | Anybody (headlines, race numbers) and Atkinson Hyperlegible Next (text), self-hosted |
| Tests | Vitest for messages, cart lines, and order and quote messages |

The build tracing root is the workspace root (`next.config.ts`), so the standalone output carries
the shared packages and `docker/Dockerfile` in the workspace can copy it as is.

## Routes

Every page is under `src/app/[locale]/` and prerendered for both languages
(`generateStaticParams`). Unknown paths inside a locale go to `[...rest]`, which shows the
localized not-found page.

| Path | Page |
|---|---|
| `/` | Home: starting grid, age ruler, what comes with a robot, Drop band, add-ons, how to buy, business teaser, questions |
| `/robot` | Catalogue with the goal filter (client component over server-rendered rows) |
| `/robot/<slug>` | Robot page: packages, buy box, abilities, Momo's four builds, learning path preview, box contents, specs, parts, add-ons, bulk call to action |
| `/drop` | The next Drop, how Drops work, the number series |
| `/aksesori`, `/aksesori/<slug>` | Accessories by kind; a product page with what is in the pack and which robots it fits |
| `/keranjang` | Cart and delivery details; not indexed |
| `/belajar` | The three parts of a step, a path per robot, the simulator, the guides |
| `/belajar/<robot>` | A robot's learning path: steps, simulator missions, guides, videos |
| `/belajar/panduan/<slug>` | One guide, with where it sits on the learning paths |
| `/bisnis` | Bulk orders, OEM at three depths, software under your brand, the process, a quote form, questions |
| `/bantuan` | How to buy, questions, contact, guides |
| `/sitemap.xml`, `/robots.txt` | Every public page in both languages; the cart is left out |

## Data

`@taksu/catalog` is the single source of truth. Pages pick the locale's string with `pick()`; no
page types a price, an age, or a robot name.

| Catalogue file | Used for |
|---|---|
| `brand.ts` | Name, tagline, meaning, contact email |
| `robots.ts` | Robots, numbers, ages, levels, goals, abilities, specs, prices, packages, availability |
| `shop.ts` | Accessories and upgrade packs, availability labels, rupiah formatting, marketplaces |
| `drops.ts` | Drops and how they work; the next free number |
| `learn.ts`, `guides.ts`, `sim-missions.ts` | Learning paths, guides, and the simulator missions they open |
| `faq.ts`, `business.ts` | Questions; bulk buyers, what comes with bulk, OEM levels, process, business questions |

A robot or product is orderable when its availability is not `soon` and it has a price; otherwise
the page offers "let me know", which opens a prefilled WhatsApp message (or an email).

## Cart and ordering

```mermaid
flowchart LR
    A[Add to cart] --> L[(localStorage<br/>taksu-cart)]
    L --> V[Cart page]
    V -- resolveLine --> C[@taksu/catalog<br/>names and prices]
    V -- buildOrder --> M[One message:<br/>items, subtotal, address]
    M --> W[wa.me]
    M --> E[mailto]
```

- `lib/cart.ts` keeps `{ key, slug, option, qty }` lines in this browser only, behind
  `useSyncExternalStore`, and follows other tabs through the `storage` event. Storage can be
  missing or blocked, so every read and write is guarded and the cart then starts empty.
- `lib/cart-items.ts` prices each line from the catalogue at render time and drops lines that are
  no longer for sale, so a stale cart never shows an old price.
- `lib/order.ts` and `lib/quote.ts` build the order and the quote request as plain text from the
  message files; their tests run against the real Indonesian and English strings.
- `lib/links.ts` makes `wa.me` links (digits only, or none when no number is configured) and
  `mailto:` links, and the marketplace links: a product's own listing, or the store page.

Nothing a buyer types is stored by the site: it goes straight into the message they send.

## Learning paths and the simulator

A step either opens a simulator mission or a guide. `simulatorUrl(locale, robot, mission)` builds
`https://<simulator>/<locale>?robot=ciko&mission=ciko-garis`; the simulator links each mission back
to `/belajar/<robot>#<step>` here. Videos (`components/learn/step-video.tsx`) show a thumbnail and
load the youtube-nocookie.com player only after a click.

## Languages

`src/i18n/routing.ts` takes the locales from the catalogue. UI strings live in
`messages/{id,en}.json`, typed through `src/types/next-intl.d.ts`, so a missing key fails the
typecheck and `src/messages.test.ts` fails when the two files differ.

## Images and social cards

Robot photos are static imports with blur placeholders; `imageFit()` keeps product shots on white
and lets scene renders (Garu) fill the frame. `pageMetadata()` writes the canonical URL, hreflang
alternates, and the social card `/og/<site|robot>-<locale>.jpg` from `public/og`.

## Configuration

Public settings are inlined at build time (`lib/site-config.ts`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WEB_URL` | This site's address: canonical links, sitemap, social cards |
| `NEXT_PUBLIC_SIM_URL` | The simulator's address, for every mission link |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Where orders, quotes, and questions go; empty means email only |
| `NEXT_PUBLIC_EMAIL` | Email orders; defaults to the address in `brand.ts` |
| `NEXT_PUBLIC_TOKOPEDIA_URL`, `NEXT_PUBLIC_SHOPEE_URL` | Store pages; their buttons hide while empty |
