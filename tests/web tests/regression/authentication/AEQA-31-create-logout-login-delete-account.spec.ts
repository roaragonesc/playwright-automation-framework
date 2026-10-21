import { qase } from 'playwright-qase-reporter';
import { test, expect } from '../../../../fixtures/ui.fixture';
import { createSyntheticRegistrationData } from '../../../../test-data/users/synthetic-registration';

type SyntheticAccount = ReturnType<typeof createSyntheticRegistrationData>;

let accountForCleanup: SyntheticAccount | undefined;

test.beforeEach(() => {
  accountForCleanup = undefined;
});

test.afterEach(async ({ home, login, registration }) => {
  const account = accountForCleanup;
  accountForCleanup = undefined;
  if (!account) return;

  await home.closeInterstitialIfVisible();
  if (await registration.accountDeletedMessage.isVisible().catch(() => false)) return;

  if (await registration.accountCreatedHeading.isVisible().catch(() => false)) {
    await registration.continueAfterAccountCreated();
  }

  if (!await home.deleteAccountLink.isVisible().catch(() => false)) {
    await home.open();
    await home.goToLogin();
    await login.login(account.email, account.accountDetails.password);
  }

  await expect(home.page.locator('header')).toContainText(`Logged in as ${account.displayName}`);
  await home.deleteAccount();
  await expect(registration.accountDeletedMessage).toBeVisible();
});

test(qase(31, 'Create an account, log out, log back in, and delete it'), async ({
  home,
  login,
  registration,
}) => {
  const account = createSyntheticRegistrationData();

  await test.step('1. Open the homepage and select Signup / Login.', async () => {
    await home.open();
    await home.goToLogin();
    await expect(login.signupHeading).toBeVisible();
    await expect(login.loginHeading).toBeVisible();
  });

  await test.step('2. Enter a unique name and email in the signup form.', async () => {
    await login.register(account.displayName, account.email);
    await expect(registration.accountInformationHeading).toBeVisible();
  });

  await test.step('3. Complete the synthetic profile and create the account.', async () => {
    await registration.fillAccountDetails(account.accountDetails);
    accountForCleanup = account;
    await registration.createAccount();
    await expect(registration.accountCreatedHeading).toBeVisible();
  });

  await test.step('4. Continue and verify that the signed-in header displays the account name.', async () => {
    await registration.continueAfterAccountCreated();
    await expect(home.page.locator('header')).toContainText(`Logged in as ${account.displayName}`);
  });

  await test.step('5. Log out and verify that the login screen is displayed again.', async () => {
    await login.logout();
    await expect(login.loginHeading).toBeVisible();
    await expect(home.loginLink).toBeVisible();
  });

  await test.step('6. Log in with the same account and verify the displayed name.', async () => {
    await login.login(account.email, account.accountDetails.password);
    await expect(home.page.locator('header')).toContainText(`Logged in as ${account.displayName}`);
  });

  await test.step('7. Delete the created account and verify the confirmation.', async () => {
    await home.closeInterstitialIfVisible();
    await home.deleteAccount();
    await expect(registration.accountDeletedMessage).toBeVisible();
    accountForCleanup = undefined;
  });
});