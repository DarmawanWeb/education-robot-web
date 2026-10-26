# Development

## Setup

This app builds inside the [DCTEdu](https://github.com/DarmawanWeb/DCTEdu) workspace, which holds
the lockfile and the shared packages (`@dctedu/catalog`, `@dctedu/ui`, `@dctedu/typescript-config`).

```bash
git clone --recursive https://github.com/DarmawanWeb/DCTEdu.git && cd DCTEdu
corepack enable                 # pnpm 10, Node 22.12 or newer
pnpm install                    # also points this submodule's git hooks at the workspace's
pnpm dev:store          # http://localhost:3000/id
pnpm dev:simulator      # http://localhost:3001/id, for the links between them
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WHATSAPP_NUMBER` to try the WhatsApp order
and quote flows; with it empty they fall back to email. After changing a robot's name, tagline, or
photo, redraw the social cards with `python3 scripts/social-cards.py` (needs Playwright).

## Scripts

Run from the workspace root (`pnpm --filter @dctedu/store <script>`) or from `apps/store`.

| Script | Does |
|---|---|
| `dev` | Next.js dev server on port 3000 |
| `build`, `start` | Production build (standalone) and server |
| `typecheck` | `next typegen`, then `tsc --noEmit` |
| `test` | Vitest |
| `lint` | Biome lint |

The workspace's [development guide](https://github.com/DarmawanWeb/DCTEdu/blob/main/docs/development.md)
has the recipes: a page, a string, a robot, a robot in development, a mission, a block, and the
brand name.

## Commits

This is its own repository: commit inside `apps/store` and push it, then record the new commit in
the workspace (`git add apps/store`, `chore: update store`). The workspace's hooks run here too:
lint-staged formats the staged files with Biome, and commitlint checks the message (Conventional
Commits, lower-case subject).

## CI

[ci.yml](../.github/workflows/ci.yml) checks out the DCTEdu workspace with its submodules, replaces
`apps/store` with the commit under test, installs, and runs Biome, the typecheck, the tests, and
the build for `@dctedu/store`. On pull requests it also runs commitlint. The Docker images are built by
the [DCTEdu](https://github.com/DarmawanWeb/DCTEdu) repository.
