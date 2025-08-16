import * as functions from 'firebase-functions';
import { getOrCreateCustomer } from './customers.js';
import { getStripe } from './stripeClient.js';

const stripe = getStripe();

export const createPortalSession = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const customerId = await getOrCreateCustomer(uid);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.PORTAL_RETURN_URL as string,
  });
  return { url: session.url };
});
