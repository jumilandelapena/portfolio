import { type Locator, type Page } from '@playwright/test';

export type Theme = 'dark' | 'light';

/** Shared chrome: header, theme toggle, skip link, footer. */
export class BasePage {
  readonly header: Locator;
  readonly logo: Locator;
  readonly nav: Locator;
  readonly themeToggle: Locator;
  readonly skipLink: Locator;
  readonly main: Locator;
  readonly footer: Locator;
  readonly deployedDate: Locator;

  constructor(readonly page: Page) {
    this.header = page.getByRole('banner');
    this.logo = this.header.getByRole('link', { name: 'jumi.', exact: true });
    this.nav = page.getByRole('navigation', { name: 'Sections' });
    this.themeToggle = page.getByRole('button', { name: /switch to (light|dark) theme/i });
    this.skipLink = page.getByRole('link', { name: 'Skip to content' });
    this.main = page.getByRole('main');
    this.footer = page.getByRole('contentinfo');
    this.deployedDate = page.getByTestId('deployed-date');
  }

  /**
   * Store a theme choice before the first page load, exactly as a returning
   * visitor would have. Seeded once per tab (sessionStorage guard), so a
   * reload inside a test sees whatever the page itself saved afterwards.
   */
  async rememberTheme(theme: Theme): Promise<void> {
    await this.page.addInitScript((value: Theme) => {
      if (window.sessionStorage.getItem('theme-seeded')) return;
      window.sessionStorage.setItem('theme-seeded', '1');
      window.localStorage.setItem('theme', value);
    }, theme);
  }

  async forgetTheme(): Promise<void> {
    await this.page.addInitScript(() => {
      window.localStorage.removeItem('theme');
    });
  }

  async currentTheme(): Promise<Theme> {
    const value = await this.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    return value === 'light' ? 'light' : 'dark';
  }

  navLink(name: string): Locator {
    return this.nav.getByRole('link', { name, exact: true });
  }

  navLinks(): Locator {
    return this.nav.getByRole('link');
  }
}
