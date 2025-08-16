import * as functions from 'firebase-functions';
import { getOrCreateCustomer } from './customers.js';
import { getStripe } from './stripeClient.js';

const stripe = getStripe();

interface CheckoutData {
  priceId: string;
}

export const createCheckoutSession = functions.https.onCall(
  async (data: CheckoutData, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    if (!data?.priceId) {
      throw new functions.https.HttpsError('invalid-argument', 'priceId is required');
    }

    const customerId = await getOrCreateCustomer(uid);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: data.priceId, quantity: 1 }],
      success_url: process.env.CHECKOUT_SUCCESS_URL as string,
      cancel_url: process.env.CHECKOUT_CANCEL_URL as string,
    });
    return { url: session.url };
  }
);
