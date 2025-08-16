import React from 'react';
import { View, Text, Button } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function CheckoutCanceled() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <XCircleIcon size={80} color="white" />
      <Text className="text-white text-2xl mt-4">Subscription Canceled</Text>
      <Text className="text-white mt-2 text-center">
        We hate to see you go but we hope to see you again.
      </Text>
      <View className="mt-8">
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
