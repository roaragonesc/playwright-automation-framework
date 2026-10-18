import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class HomePage extends BasePage {
  constructor(page: Page) { super(page); }
  async open() { await this.page.goto('/'); }
  async goToProducts() { await this.page.locator('a[href="/products"]').first().click(); }
  async goToLogin() { await this.page.locator('a[href="/login"]').first().click(); }
  async expectLoaded() { await expect(this.page).toHaveTitle(/Automation Exercise/); }
}
