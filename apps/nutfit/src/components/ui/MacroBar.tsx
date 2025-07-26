import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacroBar({ protein, carbs, fat }: Props) {
  const total = protein + carbs + fat || 1;
  return (
    <View style={styles.container}>
      <View style={[styles.protein, { flex: protein / total }]} />
      <View style={[styles.carbs, { flex: carbs / total }]} />
      <View style={[styles.fat, { flex: fat / total }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#222',
    marginVertical: 8,
  },
  protein: { backgroundColor: '#4e79a7' },
  carbs: { backgroundColor: '#f28e2c' },
  fat: { backgroundColor: '#e15759' },
});
