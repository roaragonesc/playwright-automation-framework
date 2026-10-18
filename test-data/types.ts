export interface DeliveryAddressData {
  source: 'registered-account';
  assertion: 'visible';
}

export interface RegisteredUserData {
  email: string;
  password: string;
}

export interface SyntheticPaymentData {
  classification: 'synthetic-demo-only';
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface AEQA19TestData {
  caseId: 19;
  scenario: string;
  user: RegisteredUserData;
  product: { selectionStrategy: 'first-available'; quantity: number };
  expectedDeliveryAddress: DeliveryAddressData;
  order: { comment: string };
  payment: SyntheticPaymentData;
  expected: { confirmationMessage: string };
}