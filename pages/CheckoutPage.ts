import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly orderRows: Locator;
  readonly orderTotal: Locator;
  readonly orderComment: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.orderRows = page.getByRole('row');
    this.orderTotal = page.getByRole('row', { name: /Total Amount/ }).getByRole('cell').last();
    this.orderComment = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
  }

  orderItemRow(productName: string): Locator {
    return this.orderRows.filter({ hasText: productName });
  }
}