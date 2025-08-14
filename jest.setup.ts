jest.mock(
  'firebase-admin',
  () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({ collection: jest.fn() })),
  }),
  { virtual: true }
);

jest.mock(
  'firebase',
  () => ({
    initializeApp: jest.fn(),
    auth: jest.fn(() => ({})),
  }),
  { virtual: true }
);

jest.mock(
  'stripe',
  () => {
    return function Stripe() {
      return {
        charges: { create: jest.fn() },
      };
    };
  },
  { virtual: true }
);
