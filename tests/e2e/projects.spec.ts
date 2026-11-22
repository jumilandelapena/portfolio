import { expect, test } from '../fixtures/test';

test.describe('projects', () => {
  test('PH Payroll and the AI office lead the featured grid, followed by the anomaly sentinel and the autofix agent', async ({
    home,
  }) => {
    const cards = home.projects.locator('[data-filter-items] article');
    await expect(cards.nth(0)).toHaveAttribute('id', 'project-ph-payroll');
    await expect(cards.nth(1)).toHaveAttribute('id', 'project-ai-office');
    await expect(cards.nth(2)).toHaveAttribute('id', 'project-anomaly-sentinel');
    await expect(cards.nth(3)).toHaveAttribute('id', 'project-autofix-agent');
  });

  test('the PH Payroll card is marked "Private repository", with a plain-text title and no link', async ({ home }) => {
    const card = home.project('ph-payroll');
    await expect(card.getByRole('heading', { level: 3 })).toHaveText(
      'PH Payroll (payroll system for Philippine companies)',
    );
    await expect(home.projectMeta('ph-payroll')).toHaveText('Private repository');
    await expect(card.getByRole('link')).toHaveCount(0);
  });

  test('the PH Payroll card presents a team project, names the role and says why the code is private', async ({
    home,
  }) => {
    const card = home.project('ph-payroll');
    await expect(card).toContainText('A team project; my role was developer.');
    await expect(card.getByText('What the team built', { exact: true })).toBeAttached();
    await expect(card.getByText('What I built', { exact: true })).toHaveCount(0);
    await expect(card).toContainText('The code is proprietary, so the repository is private.');
  });

  test('a card without the team flag keeps the "What I built" heading', async ({ home }) => {
    const card = home.project('anomaly-sentinel');
    await expect(card.getByText('What I built', { exact: true })).toBeAttached();
    await expect(card.getByText('What the team built', { exact: true })).toHaveCount(0);
  });

  test('the AI office card links its public repository, says it is built on Claude Code and is honest about testing', async ({
    home,
  }) => {
    const card = home.project('ai-office');
    await expect(card.getByRole('link', { name: 'Code', exact: true })).toHaveAttribute(
      'href',
      'https://github.com/jumilandelapena/ai-office',
    );
    await expect(home.projectMeta('ai-office')).toContainText('jumilandelapena/ai-office');
    await expect(card).toContainText('Built on Claude Code, and it runs inside Claude Code.');
    await expect(card).toContainText('There is no automated test suite, and the README says so.');
  });

  test('the anomaly sentinel card links the code, eval results and demo, and states its eval result', async ({
    home,
  }) => {
    const card = home.project('anomaly-sentinel');
    await expect(card.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/jumilandelapena/anomaly-sentinel',
    );
    await expect(card.getByRole('link', { name: 'Eval results' })).toHaveAttribute('href', /docs\/eval-results\.md$/);
    await expect(card.getByRole('link', { name: 'Demo GIF' })).toHaveAttribute('href', /docs\/demo\.gif$/);
    await expect(card).toContainText('8/8 incidents detected');
  });

  test('the autofix agent card keeps its code and demo links and key claims', async ({ home }) => {
    const card = home.project('autofix-agent');
    await expect(card.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/jumilandelapena/autofix-agent',
    );
    await expect(card.getByRole('link', { name: 'Agent PRs on the demo repo' })).toHaveAttribute(
      'href',
      /demo-inventory-api\/pulls/,
    );
    await expect(card).toContainText('6/6 fixed');
    await expect(card).toContainText('It never merges.');
  });
});
