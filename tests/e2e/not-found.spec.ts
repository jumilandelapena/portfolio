import { expect, test } from '../fixtures/test';

test.describe('404 page', () => {
  test('an unknown path under the base answers 404 with the custom page', async ({ notFound }) => {
    const status = await notFound.gotoMissing();
    expect(status).toBe(404);
    await expect(notFound.heading).toBeVisible();
    await expect(notFound.homeLink).toHaveAttribute('href', '/portfolio/');
    await expect(notFound.themeToggle).toBeVisible();
  });

  test('the 404 page is itself reachable and navigates home', async ({ notFound, page }) => {
    await page.goto('404.html');
    await expect(notFound.heading).toBeVisible();
    await notFound.homeLink.click();
    await expect(page).toHaveURL(/\/portfolio\/$/);
  });
});
