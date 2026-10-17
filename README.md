<div align="center">

<img src="docs/logo.svg" width="96" alt="Taksu logo">

# Taksu Education Robots web

**The store for Taksu's education robots: named robots chosen by age and goal, numbered Drops,
accessories, a cart that orders over WhatsApp, free learning paths and guides, and a business
page for bulk orders and OEM, in Indonesian and English.**

[![CI](https://github.com/DarmawanWeb/education-robot-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DarmawanWeb/education-robot-web/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/DarmawanWeb/education-robot-web?label=release&color=e3262d)](https://github.com/DarmawanWeb/education-robot-web/releases)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6%20strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![next-intl](https://img.shields.io/badge/i18n-next--intl%204-0F172A)
![Languages](https://img.shields.io/badge/UI-Indonesia%20%7C%20English-FFB020)
[![License](https://img.shields.io/badge/license-proprietary-1F2228)](LICENSE)

[Features](#features) · [Structure](#structure) · [Documentation](#documentation) · [Develop](#develop)

</div>

---

Part of [Taksu Tech](https://github.com/DarmawanWeb/TaksuTech), which deploys it as `edu`
 next to the [simulator](https://github.com/DarmawanWeb/education-robot-sim). Next.js 16
(App Router), React 19, Tailwind 4 and next-intl. Every name, price, age, and learning step comes
from `@taksu/catalog` in the workspace, so this repository builds inside it, as `apps/edu`.

There is no payment on the site. The cart turns an order into one WhatsApp message (or an email),
and Taksu replies with the total, shipping, and how to pay.

## Features

**Shop**
- **Home**: the robots on a starting grid by release number, an age ruler that places each robot
  at the age it starts from, what comes with every robot, the next Drop, add-ons, how to buy.
- **Robots** (`/robot`): the catalogue with a goal filter (starting from zero, competition prep,
  IoT, AI and ROS 2); a page per robot with packages, abilities, what is in the box, specs, parts,
  add-ons, and the first steps of its learning path.
- **Accessories** (`/aksesori`): upgrade packs, arenas, spares, and classroom kit, each with its
  own page; anything not on sale yet offers "let me know" instead of a cart button.
- **Cart** (`/keranjang`): quantities, subtotal, delivery details, then the order as a WhatsApp
  message or an email. Tokopedia and Shopee buttons appear once their links are set.

**Drops**
- Small robots from the R&D bench that continue the number series: a mystery plate until launch,
  how Drops work, and the series from #01.

**Learn**
- **Learning paths** (`/belajar/<robot>`): steps that pair one idea with a simulator mission or a
  guide, with curated videos that load from youtube-nocookie.com only after a click.
- **Guides** (`/belajar/panduan/<slug>`): numbered steps for unboxing, building, charging, and
  moving a program from the simulator to the robot, for owners and for instructors.

**Business**
- **Bulk orders and OEM** (`/bisnis`): who buys in bulk and what comes with it, OEM at three depths
  (rebrand, light custom, full custom), and a quote form that also opens as WhatsApp or email.

**Help and reach**
- Help page with questions and contact, a not-found page, a sitemap, robots rules, and a social
  card for the site and for each robot in both languages.

## Structure

```
src/
  app/[locale]/        pages: robot, drop, aksesori, keranjang, belajar, bisnis, bantuan
  components/          layout, robots, products, cart, learn, business, shared, ui
  lib/                 cart (this browser only), order and quote messages, links, metadata, images
  i18n/                routing (/id and /en), request, navigation
  assets/              robot photos and simulator screenshots, imported so Next.js sizes them
messages/              id.json and en.json; a test keeps their keys equal
public/og/             social cards, 1200 x 630
```

Colours, type, and the wordmark come from `@taksu/edu-ui` (`taksu.css`): the page is chalk white, dark
bands are asphalt, actions are red, Drops and "coming soon" are signal amber, and each robot owns a
colour.

## Documentation

| Document | Contents |
|---|---|
| [Architecture](docs/architecture.md) | Stack, routes, where data comes from, the cart and ordering flow, learning paths and simulator links, languages, images and social cards, configuration |
| [Development](docs/development.md) | Running inside the workspace, scripts, checks, tests, recipes for a page, a message, a robot and a product, commits and CI |

## Develop

```bash
git clone --recursive https://github.com/DarmawanWeb/TaksuTech.git && cd TaksuTech
pnpm install                    # the workspace, plus the commit hooks in each submodule
pnpm dev:edu                    # http://localhost:3103/id
pnpm --filter @taksu/edu test
```

Copy `.env.example` to `.env.local` to order through a WhatsApp number. CI
([ci.yml](.github/workflows/ci.yml)) checks out the TaksuTech workspace, puts this commit at
`apps/edu`, and runs Biome, the typecheck, the tests, and the build. The images are built by the
[TaksuTech](https://github.com/DarmawanWeb/TaksuTech) repository.

Proprietary. Copyright (c) 2026 Taksu Tech, part of Ezra Robotics. All rights reserved.
