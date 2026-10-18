import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { LoginPage } from '../pages/LoginPage';
type Pages = { home: HomePage; products: ProductsPage; login: LoginPage };
export const test = base.extend<Pages>({
  home: async ({ page }, use) => { await use(new HomePage(page)); },
  products: async ({ page }, use) => { await use(new ProductsPage(page)); },
  login: async ({ page }, use) => { await use(new LoginPage(page)); }
});
export { expect };
