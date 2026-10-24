import type { Locator, Page } from '@playwright/test';
import { ProductList } from './components/ProductList';

export class CartPage {
  readonly title: Locator;
  readonly products: ProductList;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.title = page.getByRole('banner').getByText('Your Cart', { exact: true });
    this.products = new ProductList(page);
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}
