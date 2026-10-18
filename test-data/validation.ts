import type {
  AEQA19TestData,
  DeliveryAddressData,
  RegisteredUserData,
  SyntheticPaymentData,
} from './types';
import type { TestDataValidator } from './loader';

type JsonRecord = Record<string, unknown>;

function requireRecord(value: unknown, path: string): JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`[TestData] ${path} must be a JSON object.`);
  }
  return value as JsonRecord;
}

function requireString(record: JsonRecord, key: string, path: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`[TestData] Required string is missing: ${path}.${key}`);
  }
  return value.trim();
}

function validateAddress(value: unknown, path: string): DeliveryAddressData {
  const address = requireRecord(value, path);
  if (address.source !== 'registered-account' || address.assertion !== 'visible') {
    throw new Error(`[TestData] ${path} must source the address from the registered account and assert visibility.`);
  }
  return { source: 'registered-account', assertion: 'visible' };
}

function validateUser(value: unknown, path: string): RegisteredUserData {
  const user = requireRecord(value, path);
  const email = requireString(user, 'email', path);
  if (!email.includes('@')) {
    throw new Error(`[TestData] ${path}.email must be a valid email address.`);
  }

  return {
    email,
    password: requireString(user, 'password', path),
  };
}

function validatePayment(value: unknown, path: string): SyntheticPaymentData {
  const payment = requireRecord(value, path);
  const classification = requireString(payment, 'classification', path);
  if (classification !== 'synthetic-demo-only') {
    throw new Error(`[TestData] ${path}.classification must be "synthetic-demo-only".`);
  }

  const cardNumber = requireString(payment, 'cardNumber', path);
  const expiryMonth = requireString(payment, 'expiryMonth', path);
  const expiryYear = requireString(payment, 'expiryYear', path);
  const cvv = requireString(payment, 'cvv', path);
  if (!/^\d{12,19}$/.test(cardNumber)) {
    throw new Error(`[TestData] ${path}.cardNumber must contain 12 to 19 synthetic test digits.`);
  }
  if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth)) {
    throw new Error(`[TestData] ${path}.expiryMonth must be between 01 and 12.`);
  }
  if (!/^\d{4}$/.test(expiryYear)) {
    throw new Error(`[TestData] ${path}.expiryYear must contain four digits.`);
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    throw new Error(`[TestData] ${path}.cvv must contain three or four synthetic test digits.`);
  }

  return {
    classification,
    cardholderName: requireString(payment, 'cardholderName', path),
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv,
  };
}

export const validateAEQA19TestData: TestDataValidator<AEQA19TestData> = (value, sourcePath) => {
  const root = requireRecord(value, sourcePath);
  if (root.caseId !== 19) {
    throw new Error(`[TestData] ${sourcePath}.caseId must be 19 for AEQA-19.`);
  }

  const product = requireRecord(root.product, `${sourcePath}.product`);
  if (product.selectionStrategy !== 'first-available') {
    throw new Error(`[TestData] ${sourcePath}.product.selectionStrategy must be "first-available".`);
  }
  if (!Number.isInteger(product.quantity) || Number(product.quantity) < 1) {
    throw new Error(`[TestData] ${sourcePath}.product.quantity must be a positive integer.`);
  }

  const order = requireRecord(root.order, `${sourcePath}.order`);
  const expected = requireRecord(root.expected, `${sourcePath}.expected`);

  return {
    caseId: 19,
    scenario: requireString(root, 'scenario', sourcePath),
    user: validateUser(root.user, `${sourcePath}.user`),
    product: {
      selectionStrategy: 'first-available',
      quantity: Number(product.quantity),
    },
    expectedDeliveryAddress: validateAddress(
      root.expectedDeliveryAddress,
      `${sourcePath}.expectedDeliveryAddress`
    ),
    order: {
      comment: requireString(order, 'comment', `${sourcePath}.order`),
    },
    payment: validatePayment(root.payment, `${sourcePath}.payment`),
    expected: {
      confirmationMessage: requireString(expected, 'confirmationMessage', `${sourcePath}.expected`),
    },
  };
};