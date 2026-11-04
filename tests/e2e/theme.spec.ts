import { expect, test } from '../fixtures/test';
import { HomePage } from '../pages/HomePage';

test.describe('theme', () => {
  test('follows the OS preference when nothing is stored', async ({ page }) => {
    const home = new HomePage(page);
    await home.forgetTheme();
    await page.emulateMedia({ colorScheme: 'light' });
    await home.goto();
    expect(await home.currentTheme()).toBe('light');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    expect(await home.currentTheme()).toBe('dark');
  });

  test('the toggle flips the theme and the choice survives a reload', async ({ home, page }) => {
    expect(await home.currentTheme()).toBe('dark');
    await expect(home.themeToggle).toHaveAttribute('aria-label', 'Switch to light theme');

    await home.themeToggle.click();
    expect(await home.currentTheme()).toBe('light');
    await expect(home.themeToggle).toHaveAttribute('aria-label', 'Switch to dark theme');
    expect(await page.evaluate(() => window.localStorage.getItem('theme'))).toBe('light');

    await page.reload();
    expect(await home.currentTheme()).toBe('light');
    await expect(home.themeToggle).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  test('a stored theme is applied before the body exists, so nothing flashes', async ({ page }) => {
    const home = new HomePage(page);
    await home.rememberTheme('light');
    // Record the attribute the moment <body> is inserted: the <head> script has run,
    // nothing has been painted yet. Init scripts run before <html> exists, so the
    // observer watches the document itself.
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        if (document.body) {
          (window as unknown as { __themeAtBody?: string | null }).__themeAtBody =
            document.documentElement.getAttribute('data-theme');
          observer.disconnect();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await home.goto();
    const themeAtBody = await page.evaluate(
      () => (window as unknown as { __themeAtBody?: string | null }).__themeAtBody,
    );
    expect(themeAtBody).toBe('light');

    // The theme script must sit in <head>, before any stylesheet.
    const html = await page.content();
    const scriptIndex = html.indexOf("localStorage.getItem('theme')");
    const styleIndex = html.search(/<style|<link[^>]+rel="stylesheet"/);
    expect(scriptIndex).toBeGreaterThan(-1);
    expect(styleIndex === -1 || scriptIndex < styleIndex).toBe(true);
  });

  test.describe('light theme', () => {
    test.use({ theme: 'light' });

    test('renders with the light colour scheme', async ({ home, page }) => {
      expect(await home.currentTheme()).toBe('light');
      const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
      expect(scheme).toBe('light');
    });
  });
});
