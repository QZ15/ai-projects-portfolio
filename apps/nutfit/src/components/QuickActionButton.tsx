import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
}

export default function QuickActionButton({ title, style, ...props }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  text: { color: '#fff', textAlign: 'center' },
});
