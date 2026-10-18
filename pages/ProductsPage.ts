import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) { super(page); }

  async search(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
  }

  async addFirstProductToCart() {
    await this.page.locator('.add-to-cart').first().click({ force: true });
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async viewCart() {
    await this.page.goto('/view_cart');
  }
}
