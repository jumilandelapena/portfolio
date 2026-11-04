import { type Locator } from '@playwright/test';

import { expect, test } from '../fixtures/test';

/** Computed colours of the palette, as browsers report them. */
const CYAN = 'rgb(34, 211, 238)';
const WHITE_CRISP = 'rgb(244, 244, 244)';
const DEEP_SLATE = 'rgb(15, 23, 42)';

/** Parse a computed colour (`rgb(...)` or `color(srgb ...)`) into rounded 0-255 channels. */
async function channels(locator: Locator, property: string): Promise<number[]> {
  const value = await locator.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);
  const nums = value.match(/[0-9.]+/g)?.map(Number) ?? [];
  const rgb = value.startsWith('color(srgb') ? nums.slice(0, 3).map((n) => n * 255) : nums.slice(0, 3);
  return rgb.map((n) => Math.round(n));
}

/** Wait for every CSS transition on the element (and inside it) to finish, instead of a fixed timeout. */
async function settleTransitions(locator: Locator): Promise<void> {
  await locator.evaluate((el) =>
    Promise.allSettled(
      el
        .getAnimations({ subtree: true })
        .filter((a) => a instanceof CSSTransition)
        .map((a) => a.finished),
    ),
  );
}

test.describe('hover and focus feedback', () => {
  test.describe('dark theme', () => {
    test('a text link turns cyan on hover and on keyboard focus', async ({ home, isMobile }) => {
      test.skip(isMobile, 'hover is not available on touch devices');
      const link = home.certificationLinks.first();
      await expect(link).toHaveCSS('color', WHITE_CRISP);

      await link.hover();
      await settleTransitions(link);
      await expect(link).toHaveCSS('color', CYAN);

      await home.page.mouse.move(0, 0);
      await settleTransitions(link);
      await expect(link).toHaveCSS('color', WHITE_CRISP);

      await link.focus();
      await settleTransitions(link);
      await expect(link).toHaveCSS('color', CYAN);
    });

    test('the primary call to action lifts and glows on hover and on focus', async ({ home, isMobile }) => {
      test.skip(isMobile, 'lift and glow are off on touch devices');
      const cta = home.heroCta;
      await expect(cta).toHaveCSS('background-color', CYAN);
      await expect(cta).toHaveCSS('color', DEEP_SLATE);
      await expect(cta).toHaveCSS('box-shadow', 'none');

      await cta.hover();
      await settleTransitions(cta);
      await expect(cta).not.toHaveCSS('box-shadow', 'none');
      await expect(cta).toHaveCSS('translate', '0px -1px');

      await home.page.mouse.move(0, 0);
      await settleTransitions(cta);
      await expect(cta).toHaveCSS('box-shadow', 'none');

      await cta.focus();
      await settleTransitions(cta);
      await expect(cta).not.toHaveCSS('box-shadow', 'none');
      await expect(cta).toHaveCSS('translate', '0px -1px');
    });

    test('a project panel turns its border cyan on hover and when focus is inside it', async ({ home, isMobile }) => {
      test.skip(isMobile, 'hover is not available on touch devices');
      const panel = home.project('selfheal-playwright');
      const title = panel.getByRole('link', { name: 'Self-healing Playwright test agent' });
      await expect(panel).not.toHaveCSS('border-top-color', CYAN);

      await panel.hover({ position: { x: 20, y: 200 } });
      await settleTransitions(panel);
      await expect(panel).toHaveCSS('border-top-color', CYAN);
      await expect(title).toHaveCSS('color', CYAN);
      await expect(panel).toHaveCSS('translate', '0px -2px');

      await home.page.mouse.move(0, 0);
      await settleTransitions(panel);
      await expect(panel).not.toHaveCSS('border-top-color', CYAN);

      await title.focus();
      await settleTransitions(panel);
      await expect(panel).toHaveCSS('border-top-color', CYAN);
      await expect(title).toHaveCSS('color', CYAN);
    });

    test('a filter chip and a nav link turn cyan on focus, and the active chip stays filled', async ({
      home,
      page,
    }) => {
      const chip = home.projectFilter('AI');
      await chip.focus();
      await settleTransitions(chip);
      await expect(chip).toHaveCSS('color', CYAN);
      await page.keyboard.press('Enter');
      await expect(chip).toHaveCSS('background-color', CYAN);
      await expect(chip).toHaveCSS('color', DEEP_SLATE);

      const nav = home.navLink('Impact');
      await nav.focus();
      await settleTransitions(nav);
      await expect(nav).toHaveCSS('color', CYAN);
    });
  });

  test.describe('light theme', () => {
    test.use({ theme: 'light' });

    test('links use the darkened cyan on hover and the CTA keeps Deep Slate text on cyan', async ({
      home,
      isMobile,
    }) => {
      test.skip(isMobile, 'hover is not available on touch devices');
      const link = home.certificationLinks.first();
      await expect(link).toHaveCSS('color', DEEP_SLATE);
      await link.hover();
      await settleTransitions(link);
      await expect.poll(() => channels(link, 'color'), { message: 'link colour after hover' }).toEqual([24, 115, 138]);

      await expect(home.heroCta).toHaveCSS('background-color', CYAN);
      await expect(home.heroCta).toHaveCSS('color', DEEP_SLATE);
    });
  });
});

test.describe('scroll behaviour', () => {
  test('scrollspy marks the section in view with aria-current="location"', async ({ home, page }) => {
    for (const [name, id] of [
      ['Projects', 'projects'],
      ['Impact', 'impact'],
      ['Experience', 'experience'],
      ['Skills', 'skills'],
      ['Certifications', 'certifications'],
      ['About', 'about'],
      ['Contact', 'contact'],
    ] as const) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }, id);
      // Once the page cannot scroll further the last section is the one in view, whatever was asked for.
      const atEnd = await page.evaluate(
        () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2,
      );
      const expected = atEnd ? 'Contact' : name;
      await expect(home.navLink(expected), `${name} (page at end: ${String(atEnd)})`).toHaveAttribute(
        'aria-current',
        'location',
      );
      await expect(page.locator('.nav-link[aria-current="location"]')).toHaveCount(1);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('.nav-link[aria-current="location"]')).toHaveCount(0);
  });

  test('the header gains its scrolled state after 40px and loses it at the top', async ({ home, page }) => {
    await expect(home.header).toHaveAttribute('data-scrolled', 'false');
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
    await expect(home.header).toHaveAttribute('data-scrolled', 'true');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(home.header).toHaveAttribute('data-scrolled', 'false');
  });

  test('every section becomes fully visible once scrolled into view', async ({ home, page }) => {
    for (const id of ['projects', 'impact', 'experience', 'skills', 'certifications', 'about', 'contact']) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ block: 'center', behavior: 'instant' });
      }, id);
      const first = home.section(id).locator('.reveal, .reveal-stagger > *').first();
      await expect
        .poll(() => first.evaluate((el) => getComputedStyle(el).opacity), { message: `#${id} content opacity` })
        .toBe('1');
    }
  });
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('nothing starts hidden and the progress bar is not shown', async ({ home, page }) => {
    const hidden = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('.reveal, .reveal-stagger > *')).filter(
          (el) => getComputedStyle(el).opacity !== '1',
        ).length,
    );
    expect(hidden).toBe(0);
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-reveal'))).toBe(false);
    await expect(home.scrollProgress).toBeHidden();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every section and link is still there, and content shows as it scrolls into view', async ({ home, page }) => {
    for (const id of ['projects', 'impact', 'experience', 'skills', 'certifications', 'about', 'contact']) {
      await expect(home.section(id)).toBeAttached();
    }
    expect((await home.allLinks()).length).toBeGreaterThan(70);
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-reveal'))).toBe(false);

    for (const id of ['projects', 'certifications', 'contact']) {
      const first = home.section(id).locator('.reveal, .reveal-stagger > *').first();
      await first.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await expect
        .poll(() => first.evaluate((el) => getComputedStyle(el).opacity), { message: `#${id} content opacity` })
        .toBe('1');
    }
  });
});
