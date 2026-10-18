import { test, expect } from '../../../fixtures/api.fixture';

test('API-001 @smoke @regression - products list is available', async ({ productsApi }) => {
  // Given: se consulta la colección de productos
  // When: se ejecuta el endpoint GET /api/productsList
  const result = await productsApi.getAll();

  // Then: responde con éxito y lista de productos
  expect(result.httpStatus).toBe(200);
  expect(result.body.responseCode).toBe(200);
  expect(result.body.products.length).toBeGreaterThan(0);
  expect(result.body.products[0]).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
});
