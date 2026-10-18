import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { CartPage } from '../pages/CartPage';

type Pages = {
  home: HomePage;
  products: ProductsPage;
  login: LoginPage;
  registration: RegistrationPage;
  cart: CartPage;
};

export const test = base.extend<Pages>({
  home: async ({ page }, use) => { await use(new HomePage(page)); },
  products: async ({ page }, use) => { await use(new ProductsPage(page)); },
  login: async ({ page }, use) => { await use(new LoginPage(page)); },
  registration: async ({ page }, use) => { await use(new RegistrationPage(page)); },
  cart: async ({ page }, use) => { await use(new CartPage(page)); }
});

export { expect };
