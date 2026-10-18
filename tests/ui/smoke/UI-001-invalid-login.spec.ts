import { test, expect } from '../../../fixtures/ui.fixture';

test('UI-001 @smoke @regression - invalid login shows visible error', async ({ home, login }) => {
  await home.open();
  await home.goToLogin();
  await login.login('nonexistent-qa@example.com', 'invalid-password');
  await expect(home.page.getByText('Your email or password is incorrect!')).toBeVisible();
});
