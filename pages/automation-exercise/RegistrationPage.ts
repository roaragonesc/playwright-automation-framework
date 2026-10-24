import type { Locator, Page } from '@playwright/test';
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
  private readonly maleRadio: Locator;
  private readonly femaleRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly birthDay: Locator;
  private readonly birthMonth: Locator;
  private readonly birthYear: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly company: Locator;
  private readonly address: Locator;
  private readonly city: Locator;
  private readonly state: Locator;
  private readonly zipcode: Locator;
  private readonly mobileNumber: Locator;
  private readonly createAccountButton: Locator;
  private readonly continueButton: Locator;
  readonly accountInformationHeading: Locator;
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.maleRadio = page.locator('#id_gender1');
    this.femaleRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.birthDay = page.locator('#days');
    this.birthMonth = page.locator('#months');
    this.birthYear = page.locator('#years');
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.company = page.locator('#company');
    this.address = page.locator('#address1');
    this.city = page.locator('#city');
    this.state = page.locator('#state');
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
    this.accountInformationHeading = page.getByRole('heading', { name: 'ENTER ACCOUNT INFORMATION' });
    this.accountCreatedHeading = page.getByRole('heading', { name: /account created/i });
    this.accountDeletedMessage = page.getByText(/account deleted/i).first();
  }

  async fillAccountDetails(details: AccountDetails) {
    if (details.title === 'Mr.') {
      await this.maleRadio.check();
    } else {
      await this.femaleRadio.check();
    }

    await this.passwordInput.fill(details.password);
    await this.birthDay.selectOption(details.day);
    await this.birthMonth.selectOption(details.month);
    await this.birthYear.selectOption(details.year);
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.company.fill(details.company);
    await this.address.fill(details.address);
    await this.city.fill(details.city);
    await this.state.fill(details.state);
    await this.zipcode.fill(details.zipcode);
    await this.mobileNumber.fill(details.mobileNumber);
  }

  async createAccount() {
    await this.createAccountButton.click();
  }

  async continueAfterAccountCreated() {
    await this.continueButton.click();
  }
}
