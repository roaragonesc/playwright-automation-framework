import type { Page } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  async open(path: string = '/') {
    await this.page.goto(path);
    await this.acceptConsentIfVisible();
  }

  async acceptConsentIfVisible() {
    const consentButton = this.page.getByRole('button', { name: /^Consent$/i });
    if (await consentButton.isVisible().catch(() => false)) {
      await consentButton.click();
      await this.page.locator('.fc-dialog-overlay, .fc-consent-root').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
    }
  }
}
