import { randomUUID } from 'node:crypto';

export function createSyntheticRegistrationData() {
  const uniqueId = randomUUID().replaceAll('-', '').slice(0, 12);
  const firstName = 'QA';
  const lastName = `Automation${uniqueId}`;

  return {
    email: `qa-${uniqueId}@example.com`,
    displayName: `${firstName} ${lastName}`,
    accountDetails: {
      title: 'Mr.' as const,
      password: `Qa-${randomUUID()}!`,
      day: '10',
      month: '5',
      year: '1995',
      firstName,
      lastName,
      company: 'Synthetic QA',
      address: '100 Test Street',
      city: 'Testville',
      state: 'QA State',
      zipcode: '12345',
      mobileNumber: '9000000000',
    },
  };
}