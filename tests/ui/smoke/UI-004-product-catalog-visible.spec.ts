import { test, expect } from '../../../fixtures/ui.fixture';

test('UI-004 @smoke @regression - catalog exposes visible purchase actions', async ({ home, products }) => {
  await home.open();
  await home.goToProducts();
  await expect(products.page.locator('.add-to-cart').first()).toBeVisible();
});
