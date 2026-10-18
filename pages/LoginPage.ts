import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  async goToLoginPage() {
    await this.page.goto('/login');
    await this.acceptConsentIfVisible();
  }

  async login(email: string, password: string) {
    const loginForm = this.page.locator('form').filter({ has: this.page.getByRole('button', { name: 'Login' }) }).first();
    await loginForm.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await loginForm.getByRole('textbox', { name: 'Password' }).fill(password);
    await loginForm.getByRole('button', { name: 'Login' }).click();
  }

  async register(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click({ force: true });
  }

  async logout() {
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
}
