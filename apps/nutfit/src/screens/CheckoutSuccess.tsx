import React from 'react';
import { View, Text, Button } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function CheckoutSuccess() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <CheckCircleIcon size={80} color="white" />
      <Text className="text-white text-2xl mt-4">Success</Text>
      <Text className="text-white mt-2 text-center">
        We appreciate you adding us to your journey.
      </Text>
      <View className="mt-8">
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
