import type { Locator, Page } from '@playwright/test';

export class ProductItem {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;

  constructor(readonly root: Locator, name: string) {
    this.name = root.getByText(name, { exact: true });
    // These values have no semantic role or accessible label.
    this.price = root.locator('[data-test="inventory-item-price"]');
    this.quantity = root.locator('[data-test="item-quantity"]');
    this.addButton = root.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButton = root.getByRole('button', { name: 'Remove', exact: true });
  }

  async addToCart() {
    await this.addButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }
}

export class ProductList {
  readonly items: Locator;
  readonly prices: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.prices = this.items.locator('[data-test="inventory-item-price"]');
  }

  item(name: string): ProductItem {
    return new ProductItem(
      this.items.filter({ has: this.page.getByText(name, { exact: true }) }), name
    );
  }
}
