/* eslint-disable no-var */
import { stripeWebhook } from './webhook';

var constructMock: jest.Mock;
var setMock: jest.Mock = jest.fn();

jest.mock('stripe', () => {
  constructMock = jest.fn();
  return jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: constructMock },
  }));
});

jest.mock('../admin.js', () => ({
  get db() {
    setMock = jest.fn();
    return {
      collection: () => ({
        doc: () => ({ set: setMock }),
      }),
    };
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: jest.fn() },
}));

describe('stripeWebhook', () => {
  beforeEach(() => {
    constructMock.mockReset();
    setMock = jest.fn();
  });

  it('handles subscription created', async () => {
    const event = {
      type: 'customer.subscription.created',
      data: { object: { id: 'sub_1', status: 'active', customer: 'cus_1', current_period_end: 123, items: { data: [{ price: { id: 'price_1' } }] }, metadata: { uid: 'uid1' } } },
    } as any;
    constructMock.mockReturnValue(event);

    const req: any = { headers: { 'stripe-signature': 'sig' }, rawBody: Buffer.from('') };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

    await (stripeWebhook as any)(req, res);
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isPremium: true,
        subscription: expect.objectContaining({ id: 'sub_1', priceId: 'price_1' }),
      }),
      { merge: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
