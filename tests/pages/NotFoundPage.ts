import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class NotFoundPage extends BasePage {
  readonly heading: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Page not found' });
    this.homeLink = page.getByRole('link', { name: 'Back to the start' });
  }

  /** Request a path that does not exist and return the HTTP status the server answered with. */
  async gotoMissing(path = 'this-page-does-not-exist'): Promise<number | undefined> {
    const response = await this.page.goto(path);
    return response?.status();
  }
}
