import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly emptyMessage: Locator;
  readonly deleteButtons: Locator;
  readonly itemRow: Locator;
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly quantity: Locator;
  readonly totalPrice: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyMessage = page.getByText(/Cart is empty!/);
    this.deleteButtons = page.locator('#cart_info_table .cart_delete a');
    this.itemRow = page.locator('#cart_info_table tbody tr').first();
    this.productName = this.itemRow.locator('.cart_description h4 a');
    this.unitPrice = this.itemRow.locator('.cart_price p');
    this.quantity = this.itemRow.locator('.cart_quantity button');
    this.totalPrice = this.itemRow.locator('.cart_total p');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });
  }

  async ensureCartIsEmpty() {
    if (await this.emptyMessage.isVisible().catch(() => false)) {
      return;
    }

    while (await this.deleteButtons.count() > 0) {
      const deleteButton = this.deleteButtons.first();
      await deleteButton.click();
      await deleteButton.waitFor({ state: 'detached' });
    }

    await this.emptyMessage.waitFor({ state: 'visible' });
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
