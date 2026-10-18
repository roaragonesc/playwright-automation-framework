import { test, expect } from '../../../../fixtures/api.fixture';

test('API-008 @regression - Given a valid search term, when the API executes the search, then it returns products in the response', async ({ productsApi }) => {
  let result: Awaited<ReturnType<typeof productsApi.search>>;

  await test.step('Given: se realiza una búsqueda por término válido', async () => {
    // preparación del escenario
  });

  await test.step('When: la API ejecuta la búsqueda', async () => {
    result = await productsApi.search('top');
  });

  await test.step('Then: la respuesta incluye productos del término consultado', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBe(200);
    expect(result.body.products.length).toBeGreaterThan(0);
  });
});
