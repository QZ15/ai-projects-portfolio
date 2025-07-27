import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { QuickActionButton } from '../components/ui';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export default function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Page not found</Text>
      <QuickActionButton title="Go Home" onPress={() => navigation.navigate('Dashboard' as never)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: { color: colors.text, fontSize: 18, marginBottom: 16 },
});
