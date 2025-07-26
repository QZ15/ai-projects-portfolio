import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Divider() {
  return <View accessibilityRole="separator" style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#333',
    marginVertical: 8,
  },
});
