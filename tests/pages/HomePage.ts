import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly statusPanel: Locator;
  readonly resumeLink: Locator;
  readonly projects: Locator;
  readonly projectFilters: Locator;
  readonly projectCount: Locator;
  readonly projectItems: Locator;
  readonly impact: Locator;
  readonly impactStats: Locator;
  readonly impactAsOf: Locator;
  readonly certifications: Locator;
  readonly certificationFilters: Locator;
  readonly certificationCount: Locator;
  readonly certificationItems: Locator;
  readonly certificationLinks: Locator;
  readonly courseLinks: Locator;
  readonly emailLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.getByRole('heading', { level: 1 });
    this.statusPanel = page.getByTestId('test-status');
    this.resumeLink = page.getByTestId('resume-link');

    this.projects = page.getByRole('region', { name: 'Projects' });
    this.projectFilters = this.projects.getByRole('group', { name: 'Filter projects by area' });
    this.projectCount = this.projectFilters.locator('[data-filter-count]');
    this.projectItems = this.projects.locator('[data-filter-items] > [data-areas]');

    this.impact = page.getByRole('region', { name: /work impact/i });
    this.impactStats = page.getByTestId('impact-stat');
    this.impactAsOf = page.getByTestId('impact-asof');

    this.certifications = page.getByRole('region', { name: 'Certifications' });
    this.certificationFilters = this.certifications.getByRole('group', { name: 'Filter certifications by area' });
    this.certificationCount = this.certificationFilters.locator('[data-filter-count]');
    this.certificationItems = this.certifications.locator('[data-filter-items] > [data-areas]');
    this.certificationLinks = page.getByTestId('certification-link');
    this.courseLinks = page.getByTestId('course-link');

    this.emailLink = page.getByTestId('email-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
  }

  projectFilter(name: string): Locator {
    return this.projectFilters.getByRole('button', { name, exact: true });
  }

  certificationFilter(name: string): Locator {
    return this.certificationFilters.getByRole('button', { name, exact: true });
  }

  project(id: string): Locator {
    return this.page.locator(`#project-${id}`);
  }

  certification(id: string): Locator {
    return this.page.locator(`#cert-${id}`);
  }

  section(id: string): Locator {
    return this.page.locator(`section#${id}`);
  }

  /** Every anchor on the page, as `{ href, rel, target }`. */
  async allLinks(): Promise<{ href: string; rel: string; target: string; text: string }[]> {
    return this.page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => ({
        href: a.getAttribute('href') ?? '',
        rel: a.getAttribute('rel') ?? '',
        target: a.getAttribute('target') ?? '',
        text: (a.textContent ?? '').trim(),
      })),
    );
  }
}
