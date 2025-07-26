import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Button,
  ScrollView,
} from 'react-native';
import { DayTabs, ReminderItem, Reminder } from '../components/scheduler';
import useAuth from '../hooks/useAuth';
import {
  getReminders,
  saveReminder,
  updateReminder,
  logCompletion,
} from '../services/firebase';
import { scheduleAll } from '../services/notifications';

export default function Scheduler() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    if (!user) return;
    getReminders(user.uid).then(setReminders).catch(console.error);
  }, [user]);

  useEffect(() => {
    scheduleAll(reminders.filter((r) => r.enabled)).catch(console.error);
  }, [reminders]);

  const openAdd = () => {
    setEditing(null);
    setLabel('');
    setTime('12:00');
  };

  const save = async () => {
    if (!user) return;
    if (editing) {
      const updated = { ...editing, label, time };
      setReminders((r) => r.map((x) => (x.id === editing.id ? updated : x)));
      await updateReminder(user.uid, editing.id, { label, time });
    } else {
      const newRem: Omit<Reminder, 'id'> = {
        label,
        day: selected,
        time,
        type: 'habit',
        enabled: true,
      };
      await saveReminder(user.uid, newRem);
      const list = await getReminders(user.uid);
      setReminders(list);
    }
    setEditing(null);
  };

  const toggle = async (rem: Reminder, value: boolean) => {
    if (!user) return;
    setReminders((r) => r.map((x) => (x.id === rem.id ? { ...x, enabled: value } : x)));
    await updateReminder(user.uid, rem.id, { enabled: value });
  };

  const complete = async (rem: Reminder) => {
    if (!user) return;
    const date = new Date().toISOString().slice(0, 10);
    await logCompletion(user.uid, date, { label: rem.label, type: rem.type });
  };

  const edit = (rem: Reminder) => {
    setEditing(rem);
    setLabel(rem.label);
    setTime(rem.time);
  };

  const visible = reminders.filter((r) => r.day === selected);

  return (
    <View style={styles.container}>
      <DayTabs selected={selected} onSelect={setSelected} />
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16 }}>
        {visible.map((rem) => (
          <ReminderItem
            key={rem.id}
            reminder={rem}
            onToggle={toggle}
            onComplete={complete}
            onEdit={edit}
          />
        ))}
        <Button title="Add Reminder" onPress={openAdd} />
      </ScrollView>
      <Modal visible={editing !== null || label !== ''} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Reminder' : 'New Reminder'}</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="Label"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditing(null)} />
              <Button title="Save" onPress={save} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  list: { flex: 1 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: { color: '#fff', fontSize: 18, marginBottom: 8 },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
});
