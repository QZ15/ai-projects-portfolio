import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export default function SectionHeader({ children, style, ...rest }: TextProps) {
  return (
    <Text accessibilityRole="header" style={[styles.header, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
  },
});
