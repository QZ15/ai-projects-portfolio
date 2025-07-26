import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';

export type ReminderType = 'meal' | 'workout' | 'habit';
export interface Reminder {
  id: string;
  label: string;
  day: number;
  time: string;
  type: ReminderType;
  enabled: boolean;
}

interface Props {
  reminder: Reminder;
  onToggle: (reminder: Reminder, enabled: boolean) => void;
  onComplete: (reminder: Reminder) => void;
  onEdit: (reminder: Reminder) => void;
}

export default function ReminderItem({
  reminder,
  onToggle,
  onComplete,
  onEdit,
}: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{reminder.label}</Text>
          <Text style={styles.time}>{reminder.time}</Text>
        </View>
        <Switch
          value={reminder.enabled}
          onValueChange={(v) => onToggle(reminder, v)}
        />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onComplete(reminder)}>
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(reminder)}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { color: '#fff', fontSize: 16 },
  time: { color: '#ccc' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  done: { color: '#5f5', marginRight: 16 },
  edit: { color: '#4af' },
});
