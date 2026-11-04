import { type Page } from '@playwright/test';

import { expect, test } from '../fixtures/test';

/** True when the focused element shows a visible focus ring. */
async function focusedHasVisibleOutline(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const style = getComputedStyle(el);
    return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  });
}

test.describe('keyboard-only navigation', () => {
  test('tabbing walks every focusable control with a visible focus ring', async ({ home, page }, testInfo) => {
    // WebKit builds differ in whether Tab reaches links (Safari's "press Tab to highlight each
    // item" setting): the Windows build skips them, the Linux build does not. Detect it from the
    // first Tab instead of assuming, and walk whatever the engine can reach.
    await page.keyboard.press('Tab');
    const tabReachesLinks = await home.skipLink.evaluate((el) => el === document.activeElement);
    testInfo.annotations.push({ type: 'tab-reaches-links', description: String(tabReachesLinks) });

    if (tabReachesLinks) {
      await expect(home.skipLink).toBeFocused();
      expect(await focusedHasVisibleOutline(page)).toBe(true);

      await page.keyboard.press('Tab');
      await expect(home.logo).toBeFocused();

      for (const name of ['Projects', 'Impact', 'Experience', 'Skills', 'Certifications', 'About', 'Contact']) {
        await page.keyboard.press('Tab');
        await expect(home.navLink(name)).toBeFocused();
        expect(await focusedHasVisibleOutline(page), `focus ring on ${name}`).toBe(true);
      }

      await page.keyboard.press('Tab');
    }

    await expect(home.themeToggle).toBeFocused();
    expect(await focusedHasVisibleOutline(page)).toBe(true);
    await page.keyboard.press('Enter');
    expect(await home.currentTheme()).toBe('light');

    // The next stop is the first hero link where Tab reaches links, otherwise the first filter chip.
    await page.keyboard.press('Tab');
    if (tabReachesLinks) await expect(home.heroProjectsLink).toBeFocused();
    else await expect(home.projectFilter('All')).toBeFocused();
    expect(await focusedHasVisibleOutline(page)).toBe(true);

    // Links show the ring whenever they hold focus, however they got it.
    await home.navLink('Projects').focus();
    await expect(home.navLink('Projects')).toBeFocused();
    expect(await focusedHasVisibleOutline(page)).toBe(true);
  });

  test('a filter chip can be operated with the keyboard', async ({ home, page }) => {
    await home.projectFilter('API').focus();
    await page.keyboard.press('Enter');
    await expect(home.projectFilter('API')).toHaveAttribute('aria-pressed', 'true');
    await expect(home.project('little-lemon-api')).toBeVisible();
    await expect(home.project('sta')).toBeHidden();
  });
});
