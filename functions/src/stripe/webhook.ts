import Stripe from 'stripe';
import * as functions from 'firebase-functions';
import { db } from '../admin.js';
import { FieldValue } from 'firebase-admin/firestore';
import { getStripe } from './stripeClient.js';

const stripe = getStripe();

function mapStatus(status: string): boolean {
  return status === 'active' || status === 'trialing';
}

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    functions.logger.error('Webhook signature verification failed', err);
    res.status(400).send('Webhook Error');
    return;
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as any;
      const uid = sub.metadata.uid;
      if (uid) {
        await db.collection('users').doc(uid).set(
          {
            stripeCustomerId: sub.customer as string,
            isPremium: mapStatus(sub.status),
            subscription: {
              id: sub.id,
              status: sub.status,
              priceId: sub.items.data[0]?.price.id,
              current_period_end: sub.current_period_end,
            },
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any;
      const uid = sub.metadata.uid;
      if (uid) {
        await db.collection('users').doc(uid).set(
          {
            isPremium: false,
            subscription: {
              id: sub.id,
              status: sub.status,
              priceId: sub.items.data[0]?.price.id,
              current_period_end: sub.current_period_end,
            },
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
      break;
    }
    default:
      break;
  }

  res.status(200).json({ received: true });
});
