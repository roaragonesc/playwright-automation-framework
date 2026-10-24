import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { loadTestData } from '../../test-data/loader';
import { validateLoginData, type LoginData } from '../../test-data/saucedemo/login-data';

type SauceDemoFixtures = {
  login: LoginPage;
  inventory: InventoryPage;
  loginData: LoginData;
};

export const test = base.extend<SauceDemoFixtures>({
  loginData: async ({}, use) => {
    await use(await loadTestData('saucedemo/login.json', validateLoginData));
  },
  baseURL: async ({ loginData }, use) => {
    await use(loginData.baseUrl);
  },
  // Traces can include password values entered through fill().
  trace: 'off',
  login: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventory: async ({ page }, use) => { await use(new InventoryPage(page)); },
});

export { expect };
