import { test as uiTest, expect } from './ui.fixture';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { loadTestData } from '../test-data/loader';
import { validateAEQA19TestData } from '../test-data/validation';
import type { AEQA19TestData } from '../test-data/types';

type AEQA19Fixtures = {
  checkout: CheckoutPage;
  payment: PaymentPage;
  purchaseData: AEQA19TestData;
};

export const test = uiTest.extend<AEQA19Fixtures>({
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  payment: async ({ page }, use) => { await use(new PaymentPage(page)); },
  purchaseData: async ({}, use) => {
    const purchaseData = await loadTestData('checkout/AEQA-19.json', validateAEQA19TestData);
    await use(purchaseData);
  },
});

export { expect };