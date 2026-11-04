import AxeBuilder from '@axe-core/playwright';
import { type Page, test as base, expect } from '@playwright/test';

import { type Theme } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

interface Fixtures {
  /** Theme stored before navigation. Set with `test.use({ theme: 'light' })`. */
  theme: Theme;
  /** The home page, already opened in the requested theme. */
  home: HomePage;
  notFound: NotFoundPage;
  /** An axe scan scoped to WCAG 2.1 A/AA plus best practices, run once every animation has settled. */
  axe: () => Promise<Awaited<ReturnType<AxeBuilder['analyze']>>>;
}

/** Wait for CSS animations and transitions to finish so axe measures final colours, not a mid-fade frame. */
export async function settleAnimations(page: Page): Promise<void> {
  await page.evaluate(() => Promise.allSettled(document.getAnimations().map((a) => a.finished)));
}

export const test = base.extend<Fixtures>({
  theme: ['dark', { option: true }],

  home: async ({ page, theme }, use) => {
    const home = new HomePage(page);
    await home.rememberTheme(theme);
    await home.goto();
    await use(home);
  },

  notFound: async ({ page, theme }, use) => {
    const notFound = new NotFoundPage(page);
    await notFound.rememberTheme(theme);
    await use(notFound);
  },

  axe: async ({ page }, use) => {
    await use(async () => {
      await settleAnimations(page);
      return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
    });
  },
});

export { expect };
