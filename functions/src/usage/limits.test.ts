import { assertPremiumOrWithinLimit } from './limits';
import * as functions from 'firebase-functions';

const getUsageMock = jest.fn();
const setUsageMock = jest.fn();
const getUserMock = jest.fn();
var runTransactionMock: jest.Mock;

jest.mock('firebase-functions', () => ({
  https: {
    HttpsError: class extends Error {
      code: string;
      constructor(code: string, message: string) {
        super(message);
        this.code = code;
      }
    },
  },
}));

jest.mock('firebase-admin', () => {
  runTransactionMock = jest.fn();
  return {
    firestore: () => ({
      collection: (name: string) => ({
        doc: () => ({
          get: name === 'users' ? getUserMock : undefined,
        }),
      }),
      runTransaction: runTransactionMock,
    }),
  } as any;
});

describe('assertPremiumOrWithinLimit', () => {
  beforeEach(() => {
    runTransactionMock.mockClear();
    getUsageMock.mockReset();
    setUsageMock.mockReset();
    getUserMock.mockReset();
    runTransactionMock.mockImplementation((cb: any) => cb({ get: getUsageMock, set: setUsageMock }));
  });

  it('increments usage for free user', async () => {
    getUserMock.mockResolvedValue({ data: () => ({}) });
    getUsageMock.mockResolvedValue({ data: () => ({ meal: 1, workout: 0 }) });
    await assertPremiumOrWithinLimit('u1', 'meal');
    expect(setUsageMock).toHaveBeenCalled();
  });

  it('throws when limit reached', async () => {
    getUserMock.mockResolvedValue({ data: () => ({}) });
    getUsageMock.mockResolvedValue({ data: () => ({ meal: 3, workout: 0 }) });
    await expect(assertPremiumOrWithinLimit('u1', 'meal')).rejects.toBeInstanceOf(functions.https.HttpsError);
  });

  it('skips increment for premium', async () => {
    getUserMock.mockResolvedValue({ data: () => ({ isPremium: true }) });
    await assertPremiumOrWithinLimit('u1', 'meal');
    expect(runTransactionMock).not.toHaveBeenCalled();
  });
});
