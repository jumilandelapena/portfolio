# Jumilan L. Dela Peña, portfolio

[![CI](https://github.com/jumilandelapena/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/jumilandelapena/portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/jumilandelapena/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/jumilandelapena/portfolio/actions/workflows/deploy.yml)
![Lighthouse budgets 95+](https://img.shields.io/badge/lighthouse-95%2B%20in%20every%20category-2fb8a6)
![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2fb8a6)

The personal site of a software engineer with deep test-automation expertise,
built so that the repository itself shows how I work: typed content, a test
suite on the Page Object Model across five browsers, accessibility and visual
checks, Lighthouse budgets, and a deploy that only happens when every gate is
green. The page then shows the summary of the run that deployed it.

**Live:** https://jumilandelapena.github.io/portfolio/

## Stack

| Layer        | Choice                                                                              |
| ------------ | ----------------------------------------------------------------------------------- |
| Framework    | [Astro](https://astro.build) 7, static output, no client framework                  |
| Styling      | Tailwind CSS v4 through `@tailwindcss/vite`; tokens as CSS custom properties        |
| Language     | TypeScript strict everywhere, including config files                                |
| Content      | Astro content collections with Zod schemas, JSON data under `src/content/`          |
| Images       | `astro:assets` (responsive WebP, real alt text); build-time OG image with satori    |
| Tests        | Playwright, `@axe-core/playwright`, visual snapshots, Lighthouse CI                 |
| Lint, format | ESLint flat config (typescript-eslint, astro, jsx-a11y), Prettier (astro, tailwind) |
| CI/CD        | GitHub Actions; GitHub Pages deploy through the official Pages actions              |
| Tooling      | pnpm 12 (`packageManager`), Node 26 LTS (`.nvmrc`), Dependabot                      |

The only client-side JavaScript is the theme toggle and the two filter groups,
each a few lines of plain TypeScript.

## Architecture

```
src/
├─ site.config.ts        SITE, BASE, person, hero copy, url() helper
├─ content.config.ts     Zod schema for every collection
├─ content/              the data: experience, projects, impact, skills,
│                        certifications, courses, disciplines, socials, education
├─ layouts/Base.astro    <head>, no-flash theme script, skip link, landmarks
├─ components/           one component per section + Header, Footer, ThemeToggle
├─ pages/                index.astro, 404.astro, og.png.ts, robots.txt.ts, site.webmanifest.ts
├─ lib/                  status (CI summary), github (optional repo metadata), format
├─ scripts/filter.ts     the client-side filter
└─ styles/global.css     design tokens (@theme), base styles, the one animation
tests/                   Playwright suite, see docs/testing.md
scripts/                 write-test-status.ts, gen-favicons.ts
.github/workflows/       ci.yml, deploy.yml, snapshots.yml
```

### How content collections work

Every list on the page is rendered from `src/content/`. `src/content.config.ts`
declares a collection per folder or file with a Zod schema, so a typo in a data
file fails `pnpm build` with a message that names the file and field. Components
call `getCollection()` and never contain content. Cross-references use
`reference()`: a skill points at the projects and roles where it was used, a
course points at its certification, a discipline at its certificates.

At build time `src/lib/github.ts` optionally fetches each project's primary
language and last push date from the GitHub API (authenticated with
`GITHUB_TOKEN` in CI). Any failure logs a warning and the page shows the static
data only; the build never fails because of it.

## Design

Four named colours ("Tech & Futuristic") in `src/styles/global.css`; everything
else is derived with `color-mix(in srgb)` so the palette cannot grow by accident,
and no component carries a hex value.

| Token         | Value     | Role                                                     |
| ------------- | --------- | -------------------------------------------------------- |
| `slate-deep`  | `#0F172A` | dark background; text on light; text on the cyan CTA     |
| `cyan`        | `#22D3EE` | links, focus rings, active chips, passing rows, CTA fill |
| `slate-muted` | `#64748B` | borders, dividers, icons, large text only                |
| `white-crisp` | `#F4F4F4` | text on dark; light background                           |

Derived tokens, with the WCAG contrast ratio of every text pair:

| Theme | Pair                                                     | Ratio         |
| ----- | -------------------------------------------------------- | ------------- |
| dark  | body `#F4F4F4` on `#0F172A` / on surface `#1D2436`       | 16.23 / 14.06 |
| dark  | muted small text `#818EA0` (slate + 20% white) on both   | 5.36 / 4.65   |
| dark  | Muted Slate `#64748B` on bg, large text and icons only   | 3.75          |
| dark  | cyan links on bg / on surface                            | 9.88 / 8.56   |
| both  | CTA text Deep Slate on the cyan fill                     | 9.88          |
| light | body `#0F172A` on `#F4F4F4` / on surface `#EBECEE`       | 16.23 / 15.10 |
| light | muted small text `#5B6A80` (slate + 11% deep) on both    | 5.00 / 4.65   |
| light | links and focus ring `#18738A` (cyan + 51% deep) on both | 4.95 / 4.60   |

Bright cyan is 1.64:1 on white, so in the light theme it is reserved for
non-text accents (the CTA fill, the progress bar) and text uses the darkened mix.

Motion follows one easing (`--ease-out`) and two durations (150 ms colour,
200 ms transform). Hover states also apply on `:focus-visible`; lift and glow are
limited to `(hover: hover) and (pointer: fine)` so they never stick on touch.
Section content reveals on scroll with CSS scroll-driven animations where
supported (per-item `animation-range` offsets for the stagger), an
IntersectionObserver fallback elsewhere, and nothing hidden without JavaScript
or under `prefers-reduced-motion: reduce`. Only `transform`, `opacity` and colours
animate. `src/scripts/motion.ts` is the single script: scrollspy
(`aria-current="location"`), the scrolled header, and the reveal fallback.

## Testing strategy

Short version; the long one is [docs/testing.md](docs/testing.md).

- **Page Object Model.** `tests/pages/` holds the locators, `tests/fixtures/`
  the custom `test` with a ready `home` page and a `theme` option. Locators are
  role-based (`getByRole`, `getByTestId`); no CSS class selectors.
- **Browsers.** Desktop Chromium, Firefox and WebKit plus Pixel 7 and iPhone 14
  emulation, all against the production build under `/portfolio`.
- **End-to-end.** Section links and hashes, the header logo, the skip link, the
  theme toggle (follows the OS, persists, applies before the body exists so
  nothing flashes), project and certificate filters, external `rel`, the
  résumé download, the 404 page with a real 404 status, the status panel.
- **Data integrity.** Every entry of every collection is found on the page with
  its exact link; the Work Impact numbers, as-of date and source match the data
  file.
- **Accessibility.** axe-core (WCAG 2.1 A/AA + best practice) on every page in
  both themes, failing on serious or critical violations; a keyboard-only walk
  that asserts a visible focus ring at each stop.
- **Visual regression.** `toHaveScreenshot` for the hero and status panel, a
  project card, the impact numbers and the first certification, Chromium only,
  baselines generated on Linux (CI workflow or the Playwright Docker image).
- **Links.** Internal links block CI; external links run in a separate
  non-blocking job.
- **Motion.** Hover and keyboard-focus colours, the lift and glow, scrollspy,
  the scrolled header, reveals, reduced motion and a no-JavaScript run.
- **Lighthouse CI.** Performance, Accessibility, Best Practices and SEO all
  asserted at 0.95 or better.

## Local development

```bash
corepack enable          # once; picks up pnpm@12.16.1 from package.json
pnpm install
pnpm dev                 # http://localhost:4321/portfolio/
pnpm build && pnpm preview
pnpm lint                # eslint + prettier --check
pnpm typecheck           # astro check + tsc --noEmit
pnpm test                # builds, previews and runs the Playwright suite
pnpm lhci                # Lighthouse CI against the preview
```

Node 26 is the version in `.nvmrc` and in CI; Node 24 works too.

## Deploy flow

`deploy.yml` runs on every push to `main`:

1. **verify:** lint, typecheck, build, Playwright on all projects, Lighthouse CI,
   then `scripts/write-test-status.ts` summarises the run into
   `test-status.json` and uploads it as an artifact.
2. **deploy** (only if verify passed): downloads the summary into `public/`,
   builds again so the status panel carries this run's numbers, and publishes
   `dist/` with `actions/upload-pages-artifact` and `actions/deploy-pages`.

The Pages source for the repository is "GitHub Actions"; no other setting is
needed. Pull requests run the same gates in `ci.yml` without deploying.

## Adding content

Edit a data file, run `pnpm build`, open a pull request. No markup changes.

- **A project:** add `src/content/projects/<id>.json` with `title`, `repo`,
  `url`, `tagline`, `areas` (`testing`, `ai`, `api`, `web`), `order` and, for a
  featured entry, `featured: true`, `problem`, `built`, `testing`, `highlights`,
  `stack` and `links`. The id is the file name and is what skills reference.
- **A certification:** add `src/content/certifications/<id>.json` (`title`,
  `provider`, `kind`, `url`, `areas`, `year`, `description`, `order`), then its
  courses to `src/content/courses.json` with `"certification": "<id>"`.
- **An impact stat:** edit `src/content/impact/clinicmind.json`; update `asOf`
  in the same change. The data-integrity test fails if the page and file differ.
- **A role:** add `src/content/experience/<id>.json`; link skills to it by id.

The content inventory used for the rebuild is in
[docs/content-inventory.md](docs/content-inventory.md).

## Conventions

- Conventional Commits: `feat:`, `fix:`, `test:`, `ci:`, `docs:`, `chore:`.
- Work on a branch, open a pull request, let CI go green, merge. `main` deploys.
- `TODO(jumi):` marks a fact still to confirm; they live in data files and
  comments, never in rendered copy.

## Licence

Code is MIT licensed, see [LICENSE](LICENSE). The site's content, text, data
files, résumé and photographs are © Jumilan L. Dela Peña.
