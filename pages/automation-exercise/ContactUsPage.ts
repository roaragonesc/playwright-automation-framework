import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactUsPage extends BasePage {
  readonly contactPage: Locator;
  readonly pageHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly attachmentInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.contactPage = page.locator('#contact-page');
    this.pageHeading = page.getByRole('heading', { name: /GET IN TOUCH/i, exact: true });
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.attachmentInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
  }

  successMessage(message: string): Locator {
    return this.contactPage.getByText(message, { exact: true });
  }
}