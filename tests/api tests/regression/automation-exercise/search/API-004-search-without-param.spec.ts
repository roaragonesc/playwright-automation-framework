import { test, expect } from '../../../../../fixtures/api.fixture';

test('API-004 @regression - Given a search without parameter, when API processes the query, then it returns functional error 400', async ({ productsApi }) => {
  let result: Awaited<ReturnType<typeof productsApi.search>>;

  await test.step('Given: se intenta buscar sin parámetro', async () => {
    // preparación del escenario
  });

  await test.step('When: la API procesa la consulta', async () => {
    result = await productsApi.search();
  });

  await test.step('Then: devuelve error funcional por entrada incompleta', async () => {
    expect(result.httpStatus).toBe(200);
    expect(result.body.responseCode).toBe(400);
  });
});
