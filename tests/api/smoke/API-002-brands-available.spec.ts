import { test, expect } from '../../../fixtures/api.fixture';

test('API-002 @smoke @regression - brands list is available', async ({ productsApi }) => {
  // Given: se consulta la colección de marcas
  // When: se ejecuta el endpoint GET /api/brandsList
  const result = await productsApi.getBrands();

  // Then: responde con éxito y marcas disponibles
  expect(result.httpStatus).toBe(200);
  expect(result.body.responseCode).toBe(200);
  expect(result.body.brands.length).toBeGreaterThan(0);
});
