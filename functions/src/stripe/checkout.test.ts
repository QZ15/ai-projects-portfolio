/* eslint-disable no-var */
import { getOrCreateCustomer } from './customers';
import { createCheckoutSession } from './checkout';
import * as functions from 'firebase-functions';

var checkoutCreateMock: jest.Mock;
var customerCreateMock: jest.Mock;
var getMock: jest.Mock;
var setMock: jest.Mock;
var authGetUserMock: jest.Mock;

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
  logger: { info: jest.fn() },
}));

jest.mock('./stripeClient', () => {
  checkoutCreateMock = jest.fn();
  customerCreateMock = jest.fn();
  return {
    getStripe: () => ({
      checkout: { sessions: { create: checkoutCreateMock } },
      customers: { create: customerCreateMock },
    }),
  };
});

jest.mock('../admin.js', () => {
  getMock = jest.fn();
  setMock = jest.fn();
  authGetUserMock = jest.fn();
  return {
    db: {
      collection: () => ({
        doc: () => ({ get: getMock, set: setMock }),
      }),
    },
    auth: {
      getUser: authGetUserMock,
    },
  };
});

describe('getOrCreateCustomer', () => {
  beforeEach(() => {
    customerCreateMock.mockReset();
    getMock.mockReset();
    setMock.mockReset();
    authGetUserMock.mockReset();
  });

  it('returns existing customer id if present', async () => {
    getMock.mockResolvedValue({ data: () => ({ stripeCustomerId: 'cus_existing' }) });
    const id = await getOrCreateCustomer('uid1');
    expect(id).toBe('cus_existing');
    expect(customerCreateMock).not.toHaveBeenCalled();
  });

  it('creates customer if missing', async () => {
    getMock.mockResolvedValue({ data: () => ({}) });
    authGetUserMock.mockResolvedValue({ email: 'a@b.com' });
    customerCreateMock.mockResolvedValue({ id: 'cus_new' });
    const id = await getOrCreateCustomer('uid1');
    expect(id).toBe('cus_new');
    expect(setMock).toHaveBeenCalledWith({ stripeCustomerId: 'cus_new' }, { merge: true });
  });
});

describe('createCheckoutSession', () => {
  beforeEach(() => {
    checkoutCreateMock.mockReset();
    getMock.mockReset();
  });

  it('creates session and returns url', async () => {
    getMock.mockResolvedValue({ data: () => ({ stripeCustomerId: 'cus_existing' }) });
    checkoutCreateMock.mockResolvedValue({ url: 'https://checkout' });
    const res = await (createCheckoutSession as any)({ priceId: 'price_123' }, { auth: { uid: 'uid1' } });
    expect(checkoutCreateMock).toHaveBeenCalledWith({
      mode: 'subscription',
      customer: 'cus_existing',
      line_items: [{ price: 'price_123', quantity: 1 }],
      success_url: undefined,
      cancel_url: undefined,
    });
    expect(res).toEqual({ url: 'https://checkout' });
  });

  it('throws if unauthenticated', async () => {
    await expect((createCheckoutSession as any)({ priceId: 'p' }, {})).rejects.toBeInstanceOf(functions.https.HttpsError);
  });
});
