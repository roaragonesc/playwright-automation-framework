import type { TestDataValidator } from '../loader';

export interface CheckoutData {
  product: { name: string; unitPriceCents: number; quantity: number };
  customer: { firstName: string; lastName: string; postalCode: string };
  expected: {
    taxCents: number;
    confirmation: string;
    dispatchMessage: string;
    cartPath: string;
    informationPath: string;
    overviewPath: string;
    completePath: string;
  };
}

function record(value: unknown, source: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`[TestData] ${source} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, source: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`[TestData] ${source} must be a nonempty string.`);
  }
  return value;
}

function cents(value: unknown, source: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`[TestData] ${source} must be nonnegative integer cents.`);
  }
  return value;
}

function path(value: unknown, source: string): string {
  const result = text(value, source);
  if (!/^\/[a-z-]+\.html$/.test(result)) {
    throw new Error(`[TestData] ${source} must be a SauceDemo page path.`);
  }
  return result;
}

export const validateCheckoutData: TestDataValidator<CheckoutData> = (value, source) => {
  const data = record(value, source);
  const product = record(data.product, `${source}.product`);
  const customer = record(data.customer, `${source}.customer`);
  const expected = record(data.expected, `${source}.expected`);
  if (product.quantity !== 1) {
    throw new Error(`[TestData] ${source} checkout scenario requires one product unit.`);
  }
  return {
    product: {
      name: text(product.name, `${source}.product.name`),
      unitPriceCents: cents(product.unitPriceCents, `${source}.product.unitPriceCents`),
      quantity: product.quantity,
    },
    customer: {
      firstName: text(customer.firstName, `${source}.customer.firstName`),
      lastName: text(customer.lastName, `${source}.customer.lastName`),
      postalCode: text(customer.postalCode, `${source}.customer.postalCode`),
    },
    expected: {
      taxCents: cents(expected.taxCents, `${source}.expected.taxCents`),
      confirmation: text(expected.confirmation, `${source}.expected.confirmation`),
      dispatchMessage: text(expected.dispatchMessage, `${source}.expected.dispatchMessage`),
      cartPath: path(expected.cartPath, `${source}.expected.cartPath`),
      informationPath: path(expected.informationPath, `${source}.expected.informationPath`),
      overviewPath: path(expected.overviewPath, `${source}.expected.overviewPath`),
      completePath: path(expected.completePath, `${source}.expected.completePath`),
    },
  };
};
