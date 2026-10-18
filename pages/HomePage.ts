import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productsLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productsLink = page.getByRole('link', { name: /Products/i }).first();
    this.loginLink = page.getByRole('link', { name: /Signup \/ Login|Login/i }).first();
    this.cartLink = page.getByRole('link', { name: /Cart/i }).first();
  }

  async open() {
    await super.open('/');
  }

  async goToProducts() {
    await this.acceptConsentIfVisible();
    await this.productsLink.click({ force: true });
  }

  async goToLogin() {
    await this.acceptConsentIfVisible();
    await this.loginLink.click({ force: true });
  }

  async goToCart() {
    await this.acceptConsentIfVisible();
    await this.cartLink.click({ force: true });
  }
}
