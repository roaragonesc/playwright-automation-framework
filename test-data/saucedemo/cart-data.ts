import type { TestDataValidator } from '../loader';

type CartProduct = { name: string; unitPriceCents: number };

export interface CartData {
  products: [CartProduct, CartProduct];
  expected: { cartPath: string; combinedPriceCents: number };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function product(value: unknown, source: string): CartProduct {
  if (!isRecord(value) || typeof value.name !== 'string' || !value.name.trim() ||
      typeof value.unitPriceCents !== 'number' ||
      !Number.isSafeInteger(value.unitPriceCents) || value.unitPriceCents <= 0) {
    throw new Error(`[TestData] ${source} requires a product name and positive integer-cent price.`);
  }
  return { name: value.name, unitPriceCents: value.unitPriceCents };
}

export const validateCartData: TestDataValidator<CartData> = (value, source) => {
  if (!isRecord(value) || !Array.isArray(value.products) || value.products.length !== 2 ||
      !isRecord(value.expected) || value.expected.cartPath !== '/cart.html') {
    throw new Error(`[TestData] ${source} requires two products and the SauceDemo cart path.`);
  }
  const first = product(value.products[0], `${source}.products[0]`);
  const second = product(value.products[1], `${source}.products[1]`);
  if (first.name === second.name || value.expected.combinedPriceCents !==
      first.unitPriceCents + second.unitPriceCents) {
    throw new Error(`[TestData] ${source} requires distinct products and their exact combined price.`);
  }
  return {
    products: [first, second],
    expected: { cartPath: value.expected.cartPath, combinedPriceCents: value.expected.combinedPriceCents },
  };
};
