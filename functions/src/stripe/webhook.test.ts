import { stripeWebhook } from './webhook';
import * as admin from 'firebase-admin';

var constructMock: jest.Mock;
const setMock = jest.fn();

jest.mock('stripe', () => {
  constructMock = jest.fn();
  return jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: constructMock },
  }));
});

jest.mock('firebase-admin', () => {
  const firestore = () => ({
    collection: () => ({
      doc: () => ({ set: setMock }),
    }),
  });
  (firestore as any).FieldValue = { serverTimestamp: jest.fn() };
  return { firestore, credential: { applicationDefault: jest.fn() } } as unknown as typeof admin;
});

describe('stripeWebhook', () => {
  beforeEach(() => {
    constructMock.mockReset();
    setMock.mockReset();
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
