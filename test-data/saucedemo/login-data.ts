import type { TestDataValidator } from '../loader';

export interface LoginData {
  baseUrl: string;
  username: string;
  password: string;
  expected: {
    inventoryPath: string;
    productsTitle: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const validateLoginData: TestDataValidator<LoginData> = (value, sourcePath) => {
  if (!isRecord(value) || !isRecord(value.expected)) {
    throw new Error(`[TestData] ${sourcePath} requires login data and expected results.`);
  }

  if (
    value.baseUrl !== 'https://www.saucedemo.com/' ||
    value.username !== 'standard_user' ||
    typeof value.password !== 'string' ||
    value.password.trim() === '' ||
    value.expected.inventoryPath !== '/inventory.html' ||
    value.expected.productsTitle !== 'Products'
  ) {
    throw new Error(`[TestData] ${sourcePath} does not match the SauceDemo TC-1 login contract.`);
  }

  return {
    baseUrl: value.baseUrl,
    username: value.username,
    password: value.password,
    expected: {
      inventoryPath: value.expected.inventoryPath,
      productsTitle: value.expected.productsTitle,
    },
  };
};
