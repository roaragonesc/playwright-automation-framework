import { test as base, expect } from './cart.fixture';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';
import { loadTestData } from '../../test-data/loader';
import { validateCheckoutData, type CheckoutData } from '../../test-data/saucedemo/checkout-data';

type CheckoutFixtures = {
  checkout: CheckoutPage;
  checkoutData: CheckoutData;
};

export const test = base.extend<CheckoutFixtures>({
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  checkoutData: async ({}, use) => {
    await use(await loadTestData('saucedemo/checkout.json', validateCheckoutData));
  },
});

export { expect };
