import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly loginEmail: Locator;
  private readonly loginPassword: Locator;
  private readonly loginButton: Locator;
  private readonly signupName: Locator;
  private readonly signupEmail: Locator;
  private readonly signupButton: Locator;
  private readonly logoutLink: Locator;
  readonly loginHeading: Locator;
  readonly signupHeading: Locator;

  constructor(page: Page) {
    super(page);
    const loginForm = page.locator('form')
      .filter({ has: page.getByRole('button', { name: 'Login' }) })
      .first();
    this.loginEmail = loginForm.getByRole('textbox', { name: 'Email Address' });
    this.loginPassword = loginForm.getByRole('textbox', { name: 'Password' });
    this.loginButton = loginForm.getByRole('button', { name: 'Login' });
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async goToLoginPage() {
    await this.page.goto('/login');
    await this.acceptConsentIfVisible();
  }

  async login(email: string, password: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async register(name: string, email: string) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
