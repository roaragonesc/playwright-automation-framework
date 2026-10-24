import { test as base, expect } from './ui.fixture';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';
import { Header } from '../../pages/saucedemo/components/Header';
import { loadTestData } from '../../test-data/loader';
import { validateCheckoutData, type CheckoutData } from '../../test-data/saucedemo/checkout-data';

type CheckoutFixtures = {
  cart: CartPage;
  checkout: CheckoutPage;
  header: Header;
  checkoutData: CheckoutData;
};

export const test = base.extend<CheckoutFixtures>({
  cart: async ({ page }, use) => { await use(new CartPage(page)); },
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  header: async ({ page }, use) => { await use(new Header(page)); },
  checkoutData: async ({}, use) => {
    await use(await loadTestData('saucedemo/checkout.json', validateCheckoutData));
  },
});

export { expect };
