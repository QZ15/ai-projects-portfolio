import { httpsCallable } from 'firebase/functions';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { navigate } from '../navigation/RootNavigation';
import { functions } from './firebase';

export async function startCheckout(priceId: string) {
  const fn = httpsCallable(functions, 'createCheckoutSessionFunction');
  const res: any = await fn({ priceId });
  const returnUrl = Linking.createURL('/');
  const result = await WebBrowser.openAuthSessionAsync(res.data.url, returnUrl);
  if (result.type === 'success' && result.url) {
    const path = Linking.parse(result.url).path;
    if (path === 'success') navigate('CheckoutSuccess');
    else if (path === 'cancel') navigate('CheckoutCanceled');
  }
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
