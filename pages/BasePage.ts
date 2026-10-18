import type { Locator, Page } from '@playwright/test';

export class BasePage {
  public readonly page: Page;
  protected readonly consentButton: Locator;
  protected readonly consentOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consentButton = page.getByRole('button', { name: /^(Consent|Consentir)$/i });
    this.consentOverlay = page.locator('.fc-dialog-overlay, .fc-consent-root');
  }

  async open(path: string = '/') {
    await this.page.goto(path);
    await this.acceptConsentIfVisible();
  }

  async acceptConsentIfVisible() {
    if (await this.consentButton.isVisible().catch(() => false)) {
      await this.consentButton.click();
      await this.consentOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
    }
  }
}
