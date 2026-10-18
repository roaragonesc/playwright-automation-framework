import { test as base, expect } from '@playwright/test';
import { ProductsClient } from '../api/ProductsClient';
import { AuthClient } from '../api/AuthClient';
type Clients = { productsApi: ProductsClient; authApi: AuthClient };
export const test = base.extend<Clients>({
  productsApi: async ({ request }, use) => { await use(new ProductsClient(request)); },
  authApi: async ({ request }, use) => { await use(new AuthClient(request)); }
});
export { expect };
