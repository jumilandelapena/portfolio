import { expect, test } from '../fixtures/test';

test.describe('test status panel', () => {
  test('shows either the CI summary of this build or an honest pending state', async ({ home }) => {
    await expect(home.statusPanel).toBeVisible();
    await expect(home.statusPanel).toContainText('This site is tested');
    const state = await home.statusPanel.getAttribute('data-state');

    if (state === 'ready') {
      await expect(home.statusPanel).toContainText(/\d+ passed/);
      await expect(home.statusPanel).toContainText(/lighthouse/i);
      const run = home.statusPanel.getByRole('link', { name: /^#\d+$/ });
      await expect(run).toHaveAttribute('href', /github\.com\/jumilandelapena\/portfolio\/actions\/runs\/\d+/);
    } else {
      expect(state).toBe('pending');
      await expect(home.statusPanel).toContainText('no CI summary for this build yet');
      await expect(home.statusPanel.getByRole('link', { name: 'latest workflow runs' })).toHaveAttribute(
        'href',
        'https://github.com/jumilandelapena/portfolio/actions',
      );
    }
  });
});
