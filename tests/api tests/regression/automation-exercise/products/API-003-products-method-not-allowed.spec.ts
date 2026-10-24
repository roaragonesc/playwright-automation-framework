import { test, expect } from '../../../../../fixtures/api.fixture';

test('API-003 @regression - Given a POST request to products, when API receives it, then it returns functional code 405', async ({ productsApi }) => {
  let result: Awaited<ReturnType<typeof productsApi.unsupportedPost>>;

  await test.step('Given: se intenta crear un producto con un POST no permitido', async () => {
    // preparación del escenario
  });

  await test.step('When: la API recibe la petición', async () => {
    result = await productsApi.unsupportedPost();
  });

  await test.step('Then: responde con el código funcional esperado para método no permitido', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBe(405);
  });
});
