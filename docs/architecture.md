# Store

The store sells DCT Edu's education robots and is the home of every robot's learning path. It is
the Next.js app in `apps/store` and reads all of its product facts from `@dctedu/catalog`
(`packages/catalog`).

## Stack

| Part | Choice |
|---|---|
| Framework | Next.js 16, App Router, Turbopack, `output: 'standalone'` |
| UI | React 19, Tailwind CSS 4, the theme and components from `@dctedu/ui` |
| Languages | next-intl 4, `/id` (default) and `/en`, prefix always present |
| Data | `@dctedu/catalog`: TypeScript objects, no database and no API |
| Fonts | Anybody (headlines, race numbers) and Atkinson Hyperlegible Next (text), self-hosted |
| Tests | Vitest for messages, cart lines, and order and quote messages |

The build tracing root is the repository root (`next.config.ts`), so the standalone output carries
the shared packages and `docker/Dockerfile` can copy it as is.

## Routes

Every page is under `src/app/[locale]/` and prerendered for both languages
(`generateStaticParams`). Unknown paths inside a locale go to `[...rest]`, which shows the
localized not-found page.

| Path | Page |
|---|---|
| `/` | Home: the starting grid (robots, robots in development, the next Drop), what comes with a robot, the add-ons that can be ordered today, one band for schools and OEM with our clients' names, and who is behind DCT Edu. Each topic is said once; its details live on its own page |
| `/robot` | Catalogue with the goal filter (client component over server-rendered rows), then the robots in development and a one-line link to the next Drop |
| `/robot/<slug>` | Robot page: packages, buy box, abilities, learning path preview, box contents, specs, parts, the add-ons that can be ordered (and how many more are coming), one line to the business page. A robot in development gets only its number, its name, and "in development" |
| `/drop` | The next Drop and how Drops work (the number series is the home page's starting grid) |
| `/accessories`, `/accessories/<slug>` | Accessories by kind: what can be ordered as cards with their picture, what is still coming as a compact list; a product page with what is in the pack and which robots it fits |
| `/cart` | Cart and delivery details; not indexed |
| `/learn` | The three parts of a step, a path per robot, the simulator, the guides |
| `/learn/<robot>` | A robot's learning path: steps, simulator missions, guides, videos |
| `/learn/guides/<slug>` | One guide, with where it sits on the learning paths |
| `/business` | Bulk orders, OEM at three depths, software under your brand, the process, our clients, a quote form, questions |
| `/help` | How to buy, questions, contact (the guides themselves are on `/learn`) |
| `/sitemap.xml`, `/robots.txt` | Every public page in both languages; the cart is left out |

Folder and path names are English; the page text stays in both languages. `next.config.ts` sends
older addresses to their pages here with permanent redirects that keep the locale:

- the Indonesian paths the store used before (`/belajar`, `/belajar/panduan/<slug>`,
  `/aksesori`, `/bisnis`, `/bantuan`, `/keranjang`);
- the first education site: the school levels become robots (`/kits/sd`, `smp`, `sma` go to
  `/robot/ciko`, `momo`, `garu`, and `/curriculum/<level>` to the learning path), the curriculum
  and guides go to `/learn` and the renamed guides, `/upgrades` to `/accessories`, `/schools` to
  `/business`, `/contact` to `/help`, `/simulator` to the simulator, and the Lab to the home page.

## Data

`@dctedu/catalog` is the single source of truth. Pages pick the locale's string with `pick()`; no
page types a price, an age, or a robot name.

| Catalogue file | Used for |
|---|---|
| `brand.ts` | Name, tagline, promise, story, contact email |
| `robots.ts` | Robots on sale (numbers, ages, levels, goals, abilities, specs, prices, availability, exclusive seller) and robots in development (number and name only) |
| `sellers.ts` | Companies that hold the exclusive right to sell some robots |
| `clients.ts` | Companies we design and build for, shown on the home and business pages |
| `shop.ts` | Accessories and upgrade packs, availability labels, rupiah formatting, marketplaces |
| `drops.ts` | Drops and how they work; the next free number |
| `learn.ts`, `guides.ts`, `sim-missions.ts` | Learning paths, guides, and the simulator missions they open |
| `faq.ts`, `business.ts` | Questions; bulk buyers, what comes with bulk, OEM levels, process, business questions |

A robot or product is orderable when its availability is not `soon` and it has a price; otherwise
the page offers "let me know", which opens a prefilled WhatsApp message (or an email).

A robot with a `seller` (`sellers.ts`) is sold only by that company. Ciko and Momo are sold
exclusively by PT Ezra Robotics Teknologi: they carry no price, never go in the cart, and their
pages, catalogue rows, and bulk calls to action show who sells them and a "Contact Ezra Robotics"
button with the robot already named in the message. Everything without a seller is sold directly
through the cart.

## Cart and ordering

```mermaid
flowchart LR
    A[Add to cart] --> L[(localStorage<br/>dctedu-cart)]
    L --> V[Cart page]
    V -- resolveLine --> C[@dctedu/catalog<br/>names and prices]
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
to `/learn/<robot>#<step>` here. Videos (`components/learn/step-video.tsx`) show a thumbnail and
load the youtube-nocookie.com player only after a click.

## Languages

`src/i18n/routing.ts` takes the locales from the catalogue. UI strings live in
`messages/{id,en}.json`, typed through `src/types/next-intl.d.ts`, so a missing key fails the
typecheck and `src/messages.test.ts` fails when the two files differ.

## Motion

The only motion that starts on its own is the starting grid on the home page: each robot drives up
into its painted slot, once, when the page opens (`.park` in `globals.css`). It is switched off for
`prefers-reduced-motion`. Everything else moves only in answer to the visitor (menus, accordions,
the wordmark's signal on hover).

## Search

Every page has a title, a description, a canonical URL and hreflang alternates. The layout adds
schema.org data ([structured-data.ts](../src/lib/structured-data.ts)): PT Dharma Cipta Teknologi as
the `Organization`, with DCT Edu as its `Brand` and its other names (`Dharma Cipta Teknologi`, `DCT`)
as `alternateName`, and the `WebSite`. Robot and accessory pages add a `Product` (with an `Offer`
when we set the price) and a `BreadcrumbList`; the help page adds an `FAQPage`. The logo for search
results is `public/brand/logo-512.png`. Set `NEXT_PUBLIC_STORE_URL` to the public address, or every
canonical link points at localhost.

## Images and social cards

Products show their icon, or a picture when `productImages` in `lib/images.ts` has one: the arena
banners use previews of their print files (`src/assets/products/`, rendered from the simulator's
`print/*.pdf` with `pdftoppm -png -scale-to-x 1600`). Robot photos are static imports with blur
placeholders; `imageFit()` keeps product shots on white
and lets photos with their own backdrop (Momo's) fill the frame. `pageMetadata()` writes the
canonical URL, hreflang alternates, and the social card `/og/<site|robot>-<locale>.jpg` from
`public/og`. `scripts/social-cards.py` draws those cards with the app's own fonts,
photos, and wordmark; run it again after a robot's name, tagline, or photo changes.

## Configuration

Public settings are inlined at build time (`lib/site-config.ts`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STORE_URL` | This site's address: canonical links, sitemap, social cards |
| `NEXT_PUBLIC_SIMULATOR_URL` | The simulator's address, for every mission link |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Where orders, quotes, and questions go; empty means email only |
| `NEXT_PUBLIC_EMAIL` | Email orders; defaults to the address in `brand.ts` |
| `NEXT_PUBLIC_TOKOPEDIA_URL`, `NEXT_PUBLIC_SHOPEE_URL` | Store pages; their buttons hide while empty |
| `NEXT_PUBLIC_EZRA_WHATSAPP_NUMBER`, `NEXT_PUBLIC_EZRA_EMAIL`, `NEXT_PUBLIC_EZRA_URL` | How to reach PT Ezra Robotics Teknologi, the exclusive seller of Ciko and Momo: WhatsApp, then email, then the website; with none set, the question comes to us |
