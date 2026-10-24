import { test, expect } from '../../../../../fixtures/saucedemo/ui.fixture';

test('TC-1 @smoke @regression - Successful login with valid credentials', {
  annotation: [
    { type: 'testiny-case-id', description: '1' },
    { type: 'testiny-project-id', description: '1' },
    { type: 'testiny', description: 'https://app.testiny.io/p/1/testcases/tc/1/edit' },
    { type: 'testiny-plan', description: 'https://app.testiny.io/p/1/testplans/tp/1' },
    { type: 'product', description: 'saucedemo' },
    { type: 'priority', description: 'High' },
  ],
}, async ({ page, login, inventory, loginData }) => {
  const inventoryUrl = new URL(loginData.expected.inventoryPath, loginData.baseUrl).href;

  await test.step('1. Open SauceDemo and verify the login form.', async () => {
    await login.open();
    await expect(page).toHaveURL(loginData.baseUrl);
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
  });

  await test.step('2. Enter the valid username and verify its value.', async () => {
    await login.enterUsername(loginData.username);
    await expect(login.usernameInput).toHaveValue(loginData.username);
  });

  await test.step('3. Enter the password and verify that it is populated and masked.', async () => {
    await login.enterPassword(loginData.password);
    await expect(login.passwordInput).toHaveAttribute('type', 'password');
    // Compare without exposing either password value in assertion failures.
    await expect.poll(async () =>
      await login.passwordInput.inputValue() === loginData.password,
      { message: 'The password field must contain the configured password.' }
    ).toBe(true);
  });

  await test.step('4. Submit login and verify redirection to inventory.', async () => {
    await login.submit();
    await expect(page).toHaveURL(inventoryUrl);
  });

  await test.step('5. Verify Products is visible and no authentication error appears.', async () => {
    await expect(inventory.productsTitle).toBeVisible();
    await expect(inventory.productsTitle).toHaveText(loginData.expected.productsTitle);
    await expect(login.authenticationError).toHaveCount(0);
    await expect(login.loginButton).toHaveCount(0);
  });

  await test.step('6. Verify that the authenticated session survives a reload.', async () => {
    await inventory.reload();
    await expect(page).toHaveURL(inventoryUrl);
    await expect(inventory.productsTitle).toBeVisible();
    await expect(login.authenticationError).toHaveCount(0);
    await expect(login.loginButton).toHaveCount(0);
  });
});
