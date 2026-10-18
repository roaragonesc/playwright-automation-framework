import { test, expect } from '../../../../fixtures/ui.fixture';

test('UI-002 @regression - signup form is visible for new accounts', async ({ home }) => {
  await home.open();
  await home.goToLogin();

  await expect(home.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  await expect(home.page.locator('[data-qa="signup-name"]')).toBeVisible();
  await expect(home.page.locator('[data-qa="signup-email"]')).toBeVisible();
  await expect(home.page.locator('[data-qa="signup-button"]')).toBeVisible();
});
