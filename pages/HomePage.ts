import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productsLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly homeLink: Locator;
  readonly contactUsLink: Locator;
  readonly interstitialClose: Locator;

  constructor(page: Page) {
    super(page);
    this.productsLink = page.getByRole('link', { name: /Products/i }).first();
    this.loginLink = page.getByRole('link', { name: /Signup \/ Login|Login/i }).first();
    this.cartLink = page.getByRole('link', { name: /Cart/i }).first();
    this.homeLink = page.getByRole('link', { name: /Home/i }).first();
    this.contactUsLink = page.getByRole('link', { name: /Contact Us/i });
    this.interstitialClose = page.getByText('Close', { exact: true });
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

  async goToContactUs() {
    await this.acceptConsentIfVisible();
    await this.contactUsLink.click();
  }

  async goToHome() {
    if (await this.interstitialClose.isVisible().catch(() => false)) {
      await this.interstitialClose.click();
    }
    await this.homeLink.click();
  }
}
