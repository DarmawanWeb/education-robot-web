# Development

## Setup

The web app builds inside the [TaksuTech](https://github.com/DarmawanWeb/TaksuTech)
workspace, which holds the lockfile and the shared packages (`@taksu/catalog`, `@taksu/edu-ui`,
`@taksu/typescript-config`).

```bash
git clone --recursive https://github.com/DarmawanWeb/TaksuTech.git && cd TaksuTech
corepack enable                 # pnpm 10, Node 22.12 or newer
pnpm install                    # also points this submodule's git hooks at the workspace's
cp apps/web/.env.example apps/web/.env.local
pnpm dev:edu                    # http://localhost:3103/id
pnpm dev:sim                    # http://localhost:3102/id, for the mission links
```

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to try the WhatsApp order and quote flows; with
it empty they fall back to email.

## Scripts

Run from the workspace root (`pnpm --filter @taksu/edu <script>`) or from `apps/edu`.

| Script | Does |
|---|---|
| `dev` | Next.js dev server on port 3103 |
| `build`, `start` | Production build (standalone) and server |
| `typecheck` | `next typegen`, then `tsc --noEmit` |
| `test` | Vitest: messages, cart lines, order and quote messages |
| `lint` | Biome lint |

`pnpm check` at the workspace root runs `biome ci .` and every typecheck and test.

## Commits

This is its own repository: commit inside `apps/edu` and push it, then record the new commit in
the workspace (`git add apps/edu`, `chore: update edu`). The workspace's hooks run here too:
lint-staged formats the staged files with Biome, and commitlint checks the message (Conventional
Commits, lower-case subject).

## Recipes

**A page.** Add `src/app/[locale]/<path>/page.tsx` with `generateMetadata` using
`pageMetadata({ locale, path, title, description })`, and `resolveLocale(params)` in the page.
Link to it with `Link` from `@/i18n/navigation` and add it to `src/app/sitemap.ts`.

**A string.** Add the key to both `messages/id.json` and `messages/en.json`. The typecheck rejects
a key that is missing, and the messages test rejects files whose keys differ. Write the
Indonesian first, then translate.

**A robot or a product.** Change `packages/catalog` in the workspace, not this app. A new robot
also needs its photo in `src/assets/robots/` with an entry in `src/lib/images.ts`, its colour in
`src/lib/robot-style.ts` (and `taksu.css`), and social cards in `public/og/`.

**Something orderable.** It goes on sale when its availability is not `soon` and it has a price.
The cart prices lines from the catalogue each time, so a price change needs no cart migration.

**A learning-path video.** Add it to the step in `packages/catalog/src/learn.ts` (YouTube id,
title, channel, language, and a note on what to watch for). Check that it still embeds before a
release.

## Design rules

- Tokens, not hex codes: `bg-primary`, `bg-ink`, `asphalt`, `bg-robot-ciko`, `type-display`,
  `type-number` from `@taksu/edu-ui/taksu.css`. Raw colours only inside illustrations.
- Keyboard focus stays visible; motion respects `prefers-reduced-motion`; every image has an alt
  text in both languages or `alt=""` when it is decorative; check 360 px wide.
- Honest copy: robots, not classes. Anything in development says so.

## CI

[ci.yml](../.github/workflows/ci.yml) checks out the TaksuTech workspace with its
submodules, replaces `apps/edu` with the commit under test, installs, and runs Biome, the
typecheck, the tests, and the build for `@taksu/edu`. On pull requests it also runs commitlint.
Images are published by the workspace repository.
