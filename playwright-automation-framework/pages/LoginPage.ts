import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }
  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }
  async expectInvalidCredentials() {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }
}
