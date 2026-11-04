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
  test('tabbing walks the skip link, section links and theme toggle with a visible focus ring', async ({
    home,
    page,
  }) => {
    await page.keyboard.press('Tab');
    await expect(home.skipLink).toBeFocused();
    expect(await focusedHasVisibleOutline(page)).toBe(true);

    await page.keyboard.press('Tab');
    await expect(home.header.getByRole('link', { name: /home$/i })).toBeFocused();

    for (const name of ['Projects', 'Impact', 'Experience', 'Skills', 'Certifications', 'About', 'Contact']) {
      await page.keyboard.press('Tab');
      await expect(home.navLink(name)).toBeFocused();
      expect(await focusedHasVisibleOutline(page), `focus ring on ${name}`).toBe(true);
    }

    await page.keyboard.press('Tab');
    await expect(home.themeToggle).toBeFocused();
    expect(await focusedHasVisibleOutline(page)).toBe(true);

    await page.keyboard.press('Enter');
    expect(await home.currentTheme()).toBe('light');
  });

  test('a filter chip can be operated with the keyboard', async ({ home, page }) => {
    await home.projectFilter('API').focus();
    await page.keyboard.press('Enter');
    await expect(home.projectFilter('API')).toHaveAttribute('aria-pressed', 'true');
    await expect(home.project('little-lemon-api')).toBeVisible();
    await expect(home.project('sta')).toBeHidden();
  });
});
