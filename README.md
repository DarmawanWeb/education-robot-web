<div align="center">

<img src="docs/logo.svg" width="96" alt="DCT Edu logo">

# DCT Edu Store

**The store for DCT Edu's education robots: named robots on a starting grid by number, accessories,
numbered Drops, a cart that orders over WhatsApp or email, free learning paths and guides, and a
page for bulk orders and OEM, in Indonesian and English.**

[![CI](https://github.com/DarmawanWeb/education-robot-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DarmawanWeb/education-robot-web/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6%20strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Languages](https://img.shields.io/badge/UI-Indonesia%20%7C%20English-FFB020)

</div>

---

Part of [DCTEdu](https://github.com/DarmawanWeb/DCTEdu), which builds it as `apps/store` next to
the [simulator](https://github.com/DarmawanWeb/education-robot-sim). Every name, price, age, and
learning step comes from `@dctedu/catalog` in that workspace, so this repository builds inside it.

There is no payment on the site. The cart turns an order into one WhatsApp message (or an email),
and the reply carries the total, shipping, and how to pay.

## Features

- **Home** (`/`): the robots on a starting grid by release number, with robots in development
  and the next Drop in their own slots; what comes with every robot; add-ons; bulk and OEM;
  questions.
- **Robots** (`/robot`): the catalogue with a goal filter, and a page per robot with abilities,
  what is in the box, specs, parts, add-ons, and the first steps of its learning path. A robot in
  development shows only its number, its name, and that it is in development.
- **Accessories** (`/accessories`): upgrade packs, arenas, spares, and classroom kit.
- **Cart** (`/cart`): quantities, subtotal, delivery details, then the order as a message.
- **Drops** (`/drop`): small robots from the R&D bench that continue the number series.
- **Learn** (`/learn`, `/learn/<robot>`, `/learn/guides/<slug>`): learning paths that pair one
  idea with a simulator mission or a guide, and step-by-step guides.
- **Business** (`/business`) and **Help** (`/help`).

The old Indonesian paths (`/belajar`, `/aksesori`, `/bisnis`, `/bantuan`, `/keranjang`) and the
first education site's addresses redirect permanently to these.

## Structure

```
src/
  app/[locale]/        pages: robot, drop, accessories, cart, learn, business, help
  components/          layout, robots, products, cart, learn, business, shared, ui
  lib/                 cart (this browser only), order and quote messages, links, metadata, images
  i18n/                routing (/id and /en), request, navigation
  assets/              robot photos and simulator screenshots, imported so Next.js sizes them
messages/              id.json and en.json; a test keeps their keys equal
public/og/             social cards, 1200 x 630, drawn by scripts/social-cards.py
```

## Documentation

| Document | Contents |
|---|---|
| [Architecture](docs/architecture.md) | Stack, routes and redirects, data, the cart and ordering flow, learning paths and simulator links, languages, images and social cards, configuration |
| [Development](docs/development.md) | Running inside the workspace, scripts, commits, CI |

## Develop

```bash
git clone --recursive https://github.com/DarmawanWeb/DCTEdu.git && cd DCTEdu
pnpm install                    # the workspace, plus the commit hooks in each submodule
pnpm dev:store                  # http://localhost:3000/id
pnpm --filter @dctedu/store test
```

DCT Edu is the education robot line of PT Dharma Cipta Teknologi.

Proprietary. Copyright (c) 2026 PT Dharma Cipta Teknologi. All rights reserved.
