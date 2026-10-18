import { test, expect } from '../../fixtures/api.fixture';
test('API-005: verificar login sin email devuelve código funcional 400', async ({ authApi }) => {
  const result = await authApi.verifyLogin(undefined, 'password');
  expect(result.body.responseCode).toBe(400);
});
test('API-006: verificar login con datos incorrectos devuelve código funcional 404', async ({ authApi }) => {
  const result = await authApi.verifyLogin('nonexistent-qa@example.com', 'wrong');
  expect(result.body.responseCode).toBe(404);
});
