import AxeBuilder from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';

import { type Theme } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

interface Fixtures {
  /** Theme stored before navigation. Set with `test.use({ theme: 'light' })`. */
  theme: Theme;
  /** The home page, already opened in the requested theme. */
  home: HomePage;
  notFound: NotFoundPage;
  /** An axe scan scoped to WCAG 2.1 A/AA plus best practices. */
  axe: () => AxeBuilder;
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
    await use(() => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']));
  },
});

export { expect };
