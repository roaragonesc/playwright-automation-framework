import { test, expect } from '../../../../fixtures/api.fixture';

test('API-007 @regression - Given empty email in the form, when login is validated, then it returns a functional validation error', async ({ authApi }) => {
  let result: Awaited<ReturnType<typeof authApi.verifyLogin>>;

  await test.step('Given: el formulario llega con email vacío', async () => {
    // preparación del escenario
  });

  await test.step('When: se realiza la validación del login', async () => {
    result = await authApi.verifyLogin('', 'should-fail');
  });

  await test.step('Then: la API reporta un fallo funcional de validación', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBeGreaterThanOrEqual(400);
  });
});
