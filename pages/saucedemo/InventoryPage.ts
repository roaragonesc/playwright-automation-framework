import type { Locator, Page } from '@playwright/test';
import { ProductList } from './components/ProductList';

export class InventoryPage {
  readonly productsTitle: Locator;
  readonly products: ProductList;

  constructor(private readonly page: Page) {
    this.productsTitle = page.getByRole('banner').getByText('Products', { exact: true });
    this.products = new ProductList(page);
  }

  async reload() {
    await this.page.reload();
  }

  async open() {
    await this.page.goto('/inventory.html');
  }
}
