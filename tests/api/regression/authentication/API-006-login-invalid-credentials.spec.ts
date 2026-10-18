import { test, expect } from '../../../../fixtures/api.fixture';

test('API-006 @regression - Given invalid credentials, when login is validated, then it returns functional code 404', async ({ authApi }) => {
  let result: Awaited<ReturnType<typeof authApi.verifyLogin>>;

  await test.step('Given: se envían credenciales inexistentes', async () => {
    // preparación del escenario
  });

  await test.step('When: la API valida el login', async () => {
    result = await authApi.verifyLogin('nonexistent-qa@example.com', 'wrong');
  });

  await test.step('Then: devuelve operación no encontrada o usuario inexistente', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBe(404);
  });
});
