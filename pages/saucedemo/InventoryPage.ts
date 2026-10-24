import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly productsTitle: Locator;

  constructor(private readonly page: Page) {
    this.productsTitle = page.getByRole('banner').getByText('Products', { exact: true });
  }

  async reload() {
    await this.page.reload();
  }
}
