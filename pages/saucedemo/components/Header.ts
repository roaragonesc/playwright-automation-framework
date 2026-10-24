import type { Locator, Page } from '@playwright/test';

export class Header {
  readonly cartButton: Locator;
  readonly menuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.cartButton = page.getByRole('button', { name: /^Cart,/ });
    this.menuButton = page.getByRole('button', { name: 'Open Menu', exact: true });
    this.logoutButton = page.getByRole('button', { name: 'Logout', exact: true });
  }

  async openCart() {
    await this.cartButton.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutButton.click();
  }
}
