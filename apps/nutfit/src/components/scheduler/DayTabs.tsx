import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  selected: number;
  onSelect: (day: number) => void;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DayTabs({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {days.map((d, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.tab, selected === idx && styles.selectedTab]}
          onPress={() => onSelect(idx)}
        >
          <Text style={styles.text}>{d}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 0, marginVertical: 8 },
  tab: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedTab: { backgroundColor: '#4a4afd' },
  text: { color: '#fff' },
});
