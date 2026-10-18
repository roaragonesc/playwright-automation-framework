import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AccountDetails {
  title: 'Mr.' | 'Mrs.';
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  mobileNumber: string;
}

export class RegistrationPage extends BasePage {
  constructor(page: Page) { super(page); }

  async fillAccountDetails(details: AccountDetails) {
    if (details.title === 'Mr.') {
      await this.page.locator('#id_gender1').check();
    } else {
      await this.page.locator('#id_gender2').check();
    }

    await this.page.locator('#password').fill(details.password);
    await this.page.locator('#days').selectOption(details.day);
    await this.page.locator('#months').selectOption(details.month);
    await this.page.locator('#years').selectOption(details.year);
    await this.page.locator('#first_name').fill(details.firstName);
    await this.page.locator('#last_name').fill(details.lastName);
    await this.page.locator('#company').fill(details.company);
    await this.page.locator('#address1').fill(details.address);
    await this.page.locator('#city').fill(details.city);
    await this.page.locator('#state').fill(details.state);
    await this.page.locator('#zipcode').fill(details.zipcode);
    await this.page.locator('#mobile_number').fill(details.mobileNumber);
  }

  async createAccount() {
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}
