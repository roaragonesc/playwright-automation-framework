import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) { super(page); }

  async open() {
    await super.open('/');
  }

  async goToProducts() {
    await this.acceptConsentIfVisible();
    await this.page.getByRole('link', { name: /Products/i }).first().click({ force: true });
  }

  async goToLogin() {
    await this.acceptConsentIfVisible();
    await this.page.getByRole('link', { name: /Signup \/ Login|Login/i }).first().click({ force: true });
  }

  async goToCart() {
    await this.acceptConsentIfVisible();
    await this.page.getByRole('link', { name: /Cart/i }).first().click({ force: true });
  }
}
