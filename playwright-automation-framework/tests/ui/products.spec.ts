import { test } from '../../fixtures/ui.fixture';
test('UI-001: catálogo y búsqueda de productos', async ({ home, products }) => {
  await home.open();
  await home.expectLoaded();
  await home.goToProducts();
  await products.search('top');
  await products.expectSearchResults();
});
