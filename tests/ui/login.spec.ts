import { test } from '../../fixtures/ui.fixture';
test('UI-002: error al iniciar sesión con credenciales incorrectas', async ({ home, login }) => {
  await home.open();
  await home.goToLogin();
  await login.login('nonexistent-qa@example.com', 'invalid-password');
  await login.expectInvalidCredentials();
});
