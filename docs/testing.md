# Testing

Everything in this repository that can be checked by a machine is checked on every
pull request and before every deploy. This page explains how the suite is put
together and how to work with it.

## Layout

```
tests/
├─ fixtures/
│  ├─ test.ts        custom `test` with `home`, `notFound`, `theme` and `axe` fixtures
│  └─ content.ts     reads src/content/* from disk for the data-integrity tests
├─ pages/            Page Object Model: BasePage, HomePage, NotFoundPage
├─ e2e/              navigation, theme, filters, links, 404, status panel
├─ data/             every collection entry renders; impact numbers match the data
├─ a11y/             axe-core on every page in both themes; keyboard-only navigation
├─ visual/           toHaveScreenshot baselines (Chromium only)
└─ links/            internal links (blocking) and external links (separate job)
```

Page objects expose role-based locators (`getByRole`, `getByTestId`) and never
CSS class selectors, so a restyle cannot break a test unless behaviour changed.

## Browsers

`playwright.config.ts` defines six projects:

| Project         | Device          | Runs                                   |
| --------------- | --------------- | -------------------------------------- |
| `chromium`      | Desktop Chrome  | e2e, data, a11y, links                 |
| `firefox`       | Desktop Firefox | e2e, data, a11y, links                 |
| `webkit`        | Desktop Safari  | e2e, data, a11y, links                 |
| `mobile-chrome` | Pixel 7         | e2e, data, a11y, links                 |
| `mobile-safari` | iPhone 14       | e2e, data, a11y, links                 |
| `visual`        | Desktop Chrome  | visual regression only, reduced motion |

The suite runs against the production build served by `astro preview` under the
`/portfolio` base path, exactly as GitHub Pages serves it.

## Commands

```bash
pnpm test                      # build, preview, run every project
pnpm test --project=chromium   # one browser
pnpm test tests/a11y           # one folder
pnpm test:ui                   # Playwright UI mode
pnpm exec playwright show-report
```

## Accessibility

`tests/a11y/axe.spec.ts` runs `@axe-core/playwright` with the WCAG 2.1 A/AA and
best-practice tag sets on the home page and the 404 page, in the dark and the
light theme. Any violation with impact `serious` or `critical` fails the test;
the full violation list is attached to the report. The count is also recorded
as a test annotation, which `scripts/write-test-status.ts` sums into the status
panel.

`tests/a11y/keyboard.spec.ts` tabs through the skip link, the section links and
the theme toggle, asserting a visible focus ring on each stop, then operates the
toggle and a filter chip with the keyboard alone. Headless WebKit never moves
Tab focus to links (Safari's "press Tab to highlight each item" setting is off and
cannot be toggled from Playwright), so on WebKit the link walk is skipped and a
separate test checks every control it can reach, plus the ring on a link focused
programmatically.

## Visual regression

Baselines live in `tests/visual/__screenshots__/` and are compared only on
Linux, because font rendering differs between operating systems:

- In CI (`ubuntu-latest`) the `visual` project compares against the committed
  baselines and fails on more than 1% changed pixels.
- On Windows and macOS `ignoreSnapshots` is on, so the visual specs run but do
  not compare, and no local baselines are needed.

A branch that has no committed baselines yet (for example the first run of a new
suite) does not fail in CI: `playwright.config.ts` switches to
`updateSnapshots: missing` for that run and `ci.yml` uploads the generated folder
as the `visual-baselines` artifact. Download it, commit it under
`tests/visual/__screenshots__/`, and the next run compares strictly.

To update the baselines after an intended change, either:

1. Run the **Update visual baselines** workflow from the Actions tab against your
   branch. It regenerates the PNGs on Linux and commits them to the branch.
2. Or generate them locally in the official Playwright image (same Ubuntu, same
   Chromium build as CI):

   ```bash
   docker run --rm -it -v "$PWD:/work" -w /work \
     mcr.microsoft.com/playwright:v1.64.1-noble \
     bash -c "corepack enable && pnpm install --frozen-lockfile && pnpm build && CI=1 pnpm test:visual:update"
   ```

Review the diff of the PNGs before committing; a baseline change is a design
change.

## Data integrity

`tests/data/collections.spec.ts` reads the JSON under `src/content/` and checks
that every project, certification, course, experience entry and social profile
is rendered with its exact link, and that each Work Impact number, its label,
the as-of date and the source appear on the page. Astro's Zod schemas already
fail the build on a malformed data file; this test proves the page shows what
the files say.

## Links

- `tests/links/internal.spec.ts` fetches every same-site link and checks every
  hash target exists. It blocks CI.
- `tests/links/external.spec.ts` requests every outbound link. It only runs with
  `CHECK_EXTERNAL_LINKS=1` and is a separate, `continue-on-error` job in
  `ci.yml`, so a Coursera or GitHub outage never blocks a merge.

## Lighthouse

`lighthouserc.json` runs Lighthouse CI three times against the preview and
asserts Performance, Accessibility, Best Practices and SEO scores of at least
0.95 on the home page and the 404 page. Results are written to
`.lighthouseci-out/`, where the status script reads the representative run.

## The status panel

`scripts/write-test-status.ts` turns `test-results/report.json` (Playwright JSON
reporter) and `.lighthouseci-out/manifest.json` into `public/test-status.json`.
`deploy.yml` runs the gates first, downloads that file into `public/`, and only
then builds the site that is published, so the panel on the page describes the
run that deployed it. Local and pull-request builds have no file and render the
pending state; `tests/e2e/status-panel.spec.ts` accepts both.
