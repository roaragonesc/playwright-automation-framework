export interface DeliveryAddressData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface RegisteredUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface AEQA20TestData {
  caseId: 20;
  scenario: string;
  suite: 'regression';
  testType: 'e2e';
  baseUrl: string;
  user: { authenticated: false };
  contactForm: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  attachment: {
    fileName: string;
    content: string;
    mimeType: 'text/plain';
  };
  expected: {
    pageHeading: string;
    confirmationDialog: true;
    successMessage: string;
    returnToHomepage: true;
  };
}