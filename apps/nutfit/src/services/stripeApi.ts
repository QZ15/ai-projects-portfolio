import { httpsCallable } from 'firebase/functions';
import * as WebBrowser from 'expo-web-browser';
import { functions } from './firebase';

export async function startCheckout(priceId: string) {
  const fn = httpsCallable(functions, 'createCheckoutSessionFunction');
  const res: any = await fn({ priceId });
  await WebBrowser.openBrowserAsync(res.data.url);
}

export async function openBillingPortal() {
  const fn = httpsCallable(functions, 'createPortalSessionFunction');
  const res: any = await fn();
  await WebBrowser.openBrowserAsync(res.data.url);
}

export async function setTester(uid: string, value: boolean) {
  const fn = httpsCallable(functions, 'setTesterAccessFunction');
  await fn({ uid, value });
}
