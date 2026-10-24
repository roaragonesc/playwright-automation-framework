import type { Locator, Page } from '@playwright/test';
import { ProductList } from './components/ProductList';

export class CartPage {
  readonly title: Locator;
  readonly products: ProductList;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.title = page.getByRole('banner').getByText('Your Cart', { exact: true });
    this.products = new ProductList(page);
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
