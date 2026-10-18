import { test, expect } from '../../../fixtures/ui.fixture';

test('UI-003 @smoke @regression - product search shows relevant results', async ({ home, products }) => {
  await home.open();
  await expect(home.page).toHaveTitle(/Automation Exercise/);
  await home.goToProducts();
  await products.search('top');
  await expect(home.page.getByText('Searched Products', { exact: true })).toBeVisible();
  await expect(home.page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  await expect(home.page.locator('.features_items').getByText('Blue Top', { exact: true }).first()).toBeVisible();
});
