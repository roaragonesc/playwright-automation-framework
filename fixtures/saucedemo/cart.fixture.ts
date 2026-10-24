import { test as base, expect } from './ui.fixture';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { Header } from '../../pages/saucedemo/components/Header';
import { loadTestData } from '../../test-data/loader';
import { validateCartData, type CartData } from '../../test-data/saucedemo/cart-data';

type CartFixtures = {
  cart: CartPage;
  header: Header;
  cartData: CartData;
};

export const test = base.extend<CartFixtures>({
  cart: async ({ page }, use) => { await use(new CartPage(page)); },
  header: async ({ page }, use) => { await use(new Header(page)); },
  cartData: async ({}, use) => {
    await use(await loadTestData('saucedemo/cart.json', validateCartData));
  },
});

export { expect };
