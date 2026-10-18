import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class ProductsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async search(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
  }
  async expectSearchResults() {
    await expect(this.page.getByText('Searched Products', { exact: true })).toBeVisible();
    await expect(this.page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  }
}
