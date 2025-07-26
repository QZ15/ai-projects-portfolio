import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuickActionButton } from '../components/ui';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export default function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page not found</Text>
      <QuickActionButton title="Go Home" onPress={() => navigation.navigate('Dashboard' as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: { color: '#fff', fontSize: 18, marginBottom: 16 },
});
