import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { startCheckout, openBillingPortal } from '../services/stripeApi';
import { useSubscription } from '../hooks/useSubscription';

const PRICE_ID_MONTHLY = 'PRICE_ID_MONTHLY';

export default function Subscription() {
  const sub = useSubscription();
  if (!sub) return <ActivityIndicator />;

  return (
    <View className="flex-1 bg-black items-center justify-center p-4">
      <Text className="text-white text-xl mb-4">Premium Subscription</Text>
      <Text className="text-white mb-4">Status: {sub.status ?? 'none'}</Text>
      <Button title="Upgrade" onPress={() => startCheckout(PRICE_ID_MONTHLY)} />
      <View style={{ height: 8 }} />
      <Button title="Manage Billing" onPress={openBillingPortal} />
    </View>
  );
}
