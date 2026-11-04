import { expect, test } from '../fixtures/test';
import { type Theme } from '../pages/BasePage';

/**
 * Pixel baselines for the sections whose layout matters most. Chromium only;
 * baselines live in tests/visual/__screenshots__ and are generated on Linux
 * (see docs/testing.md). Dynamic text (dates, GitHub metadata, the CI run
 * line) is masked so a new deploy does not change the picture.
 */
for (const theme of ['dark', 'light'] as const satisfies readonly Theme[]) {
  test.describe(`visual, ${theme} theme`, () => {
    test.use({ theme });

    test('hero and status panel', async ({ home }) => {
      await expect(home.section('top')).toHaveScreenshot(`hero-${theme}.png`, {
        mask: [home.statusPanel.locator('li').last()],
      });
    });

    test('first project card', async ({ home }) => {
      await expect(home.project('selfheal-playwright')).toHaveScreenshot(`project-${theme}.png`, {
        mask: [home.project('selfheal-playwright').getByTestId('repo-meta')],
      });
    });

    test('impact numbers', async ({ home }) => {
      await expect(home.page.getByTestId('impact-stats')).toHaveScreenshot(`impact-${theme}.png`);
    });

    test('certifications list head', async ({ home }) => {
      await expect(home.certification('meta-full-stack')).toHaveScreenshot(`certification-${theme}.png`);
    });
  });
}
