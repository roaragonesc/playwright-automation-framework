import { test, expect } from '../../../fixtures/ui.fixture';

test('UI-006 @smoke @regression - cart shows empty state by default', async ({ home }) => {
  await home.open();
  await home.goToCart();
  await expect(home.page.getByText('Cart is empty!')).toBeVisible();
});
