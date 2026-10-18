import { test, expect } from '../../fixtures/api.fixture';
test('API-001: GET productos devuelve una lista', async ({ productsApi }) => {
  const result = await productsApi.getAll();
  expect(result.httpStatus).toBe(200);
  expect(result.body.responseCode).toBe(200);
  expect(result.body.products.length).toBeGreaterThan(0);
  expect(result.body.products[0]).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
});
test('API-002: GET marcas devuelve una lista', async ({ productsApi }) => {
  const result = await productsApi.getBrands();
  expect(result.httpStatus).toBe(200);
  expect(result.body.responseCode).toBe(200);
  expect(result.body.brands.length).toBeGreaterThan(0);
});
test('API-003: POST productos no permitido (código funcional 405)', async ({ productsApi }) => {
  const result = await productsApi.unsupportedPost();
  // La API de demostración puede devolver HTTP 200 con responseCode 405 en el JSON.
  expect(result.body.responseCode).toBe(405);
});
test('API-004: búsqueda sin parámetro (código funcional 400)', async ({ productsApi }) => {
  const result = await productsApi.search();
  expect(result.body.responseCode).toBe(400);
});
