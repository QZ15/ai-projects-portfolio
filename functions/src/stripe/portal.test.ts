import { createPortalSession } from './portal';
import * as functions from 'firebase-functions';

var portalCreateMock: jest.Mock;

jest.mock('firebase-functions', () => ({
  https: {
    onCall: (fn: any) => fn,
    HttpsError: class extends Error {
      code: string;
      constructor(code: string, message: string) {
        super(message);
        this.code = code;
      }
    },
  },
}));

jest.mock('stripe', () => {
  portalCreateMock = jest.fn();
  return jest.fn().mockImplementation(() => ({
    billingPortal: { sessions: { create: portalCreateMock } },
  }));
});

jest.mock('./customers', () => ({
  getOrCreateCustomer: jest.fn().mockResolvedValue('cus_123'),
}));

describe('createPortalSession', () => {
  beforeEach(() => {
    portalCreateMock.mockReset();
  });

  it('creates portal session and returns url', async () => {
    portalCreateMock.mockResolvedValue({ url: 'https://portal' });
    const res = await (createPortalSession as any)({}, { auth: { uid: 'uid1' } });
    expect(portalCreateMock).toHaveBeenCalledWith({
      customer: 'cus_123',
      return_url: undefined,
    });
    expect(res).toEqual({ url: 'https://portal' });
  });

  it('throws if unauthenticated', async () => {
    await expect((createPortalSession as any)({}, {})).rejects.toBeInstanceOf(functions.https.HttpsError);
  });
});
