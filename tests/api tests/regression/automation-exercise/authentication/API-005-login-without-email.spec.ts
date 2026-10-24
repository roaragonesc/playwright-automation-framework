import { test, expect } from '../../../../../fixtures/api.fixture';

test('API-005 @regression - Given login without email, when API validates the request, then it returns functional code 400', async ({ authApi }) => {
  let result: Awaited<ReturnType<typeof authApi.verifyLogin>>;

  await test.step('Given: se solicita verificación de login sin email', async () => {
    // preparación del escenario
  });

  await test.step('When: la API procesa la petición', async () => {
    result = await authApi.verifyLogin(undefined, 'password');
  });

  await test.step('Then: responde con el error funcional esperado', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBe(400);
  });
});
