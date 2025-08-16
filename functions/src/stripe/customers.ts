import { db, auth } from '../admin.js';
import * as functions from 'firebase-functions';
import { getStripe } from './stripeClient.js';

const stripe = getStripe();

/**
 * Returns existing Stripe customer ID for the user or creates one.
 */
export async function getOrCreateCustomer(uid: string): Promise<string> {
  const userDocRef = db.collection('users').doc(uid);
  const userDoc = await userDocRef.get();
  const existingId = userDoc.data()?.stripeCustomerId;
  if (existingId) return existingId;

  const userRecord = await auth.getUser(uid);
  const customer = await stripe.customers.create({
    email: userRecord.email ?? undefined,
    metadata: { uid },
  });
  await userDocRef.set({ stripeCustomerId: customer.id }, { merge: true });
  functions.logger.info(`Created Stripe customer for uid ${uid}`);
  return customer.id;
}
