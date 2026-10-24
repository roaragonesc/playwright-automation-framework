import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { SyntheticPaymentData } from '../../test-data/types';

export class PaymentPage extends BasePage {
  readonly cardholderName: Locator;
  readonly cardNumber: Locator;
  readonly cvv: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payAndConfirmButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cardholderName = page.locator('[name="name_on_card"]');
    this.cardNumber = page.locator('[name="card_number"]');
    this.cvv = page.locator('[name="cvc"]');
    this.expiryMonth = page.locator('[name="expiry_month"]');
    this.expiryYear = page.locator('[name="expiry_year"]');
    this.payAndConfirmButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
  }

  async fillPaymentDetails(details: SyntheticPaymentData) {
    await this.cardholderName.fill(details.cardholderName);
    await this.cardNumber.fill(details.cardNumber);
    await this.cvv.fill(details.cvv);
    await this.expiryMonth.fill(details.expiryMonth);
    await this.expiryYear.fill(details.expiryYear);
  }
}