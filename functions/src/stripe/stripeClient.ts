import * as functions from 'firebase-functions';
import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = functions.config()?.stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing Stripe secret key (set with: firebase functions:config:set stripe.secret_key="...")');
  }
  _stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  return _stripe;
}
