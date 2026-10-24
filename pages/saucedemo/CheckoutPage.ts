import type { Locator, Page } from '@playwright/test';
import { ProductList } from './components/ProductList';

export class CheckoutPage {
  readonly informationTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly overviewTitle: Locator;
  readonly products: ProductList;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeTitle: Locator;
  readonly confirmation: Locator;
  readonly dispatchMessage: Locator;
  readonly backHomeButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    const banner = page.getByRole('banner');
    this.informationTitle = banner.getByText('Checkout: Your Information', { exact: true });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name', exact: true });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name', exact: true });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code', exact: true });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.overviewTitle = banner.getByText('Checkout: Overview', { exact: true });
    this.products = new ProductList(page);
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.completeTitle = banner.getByText('Checkout: Complete!', { exact: true });
    this.confirmation = page.getByRole('heading', { level: 2 });
    this.dispatchMessage = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home', exact: true });
    this.error = page.getByRole('alert');
  }

  async fillInformation(customer: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
