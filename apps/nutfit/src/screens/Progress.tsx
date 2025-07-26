import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button } from 'react-native';
import { SectionHeader } from '../components/ui';
import { colors, spacing } from '../theme';
import useAuth from '../hooks/useAuth';
import {
  getProgress,
  getHabits,
  getProgressFeedback,
} from '../services/firebase';
import { syncAppleHealth } from '../services/health';
import { LineChartCard, PieChartCard } from '../components/progress';

interface ProgressEntry {
  date: string;
  weight?: number;
  bodyFat?: number;
  caloriesIn?: number;
  caloriesOut?: number;
  macros?: { protein: number; carbs: number; fat: number };
}

export default function Progress() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!user) return;
    getProgress(user.uid).then(setEntries);
    getHabits(user.uid).then(setHabits);
    fetchFeedback();
  }, [user]);

  async function fetchFeedback() {
    if (!user) return;
    try {
      const res: any = await getProgressFeedback({ uid: user.uid });
      if (res?.message) setFeedback(res.message);
    } catch (e) {
      console.log('feedback error', e);
    }
  }

  async function handleSync() {
    if (user) await syncAppleHealth(user.uid);
  }

  const labels = entries.map((e) => e.date.slice(5));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader>Progress Charts</SectionHeader>
      <LineChartCard
        title="Weight"
        labels={labels}
        datasets={[{ data: entries.map((e) => e.weight || 0) }]}
      />
      <LineChartCard
        title="Body Fat %"
        labels={labels}
        datasets={[{ data: entries.map((e) => e.bodyFat || 0) }]}
      />
      <LineChartCard
        title="Calories"
        labels={labels}
        datasets={[
          { data: entries.map((e) => e.caloriesIn || 0) },
          { data: entries.map((e) => e.caloriesOut || 0) },
        ]}
      />
      {entries.length > 0 && entries[entries.length - 1].macros && (
        <PieChartCard
          title="Macros"
          slices={[
            {
              name: 'Protein',
              value: entries[entries.length - 1].macros!.protein,
              color: '#4e79a7',
            },
            {
              name: 'Carbs',
              value: entries[entries.length - 1].macros!.carbs,
              color: '#f28e2c',
            },
            {
              name: 'Fat',
              value: entries[entries.length - 1].macros!.fat,
              color: '#e15759',
            },
          ]}
        />
      )}

      <Button title="Sync Now" onPress={handleSync} />

      <SectionHeader>Habit Tracker</SectionHeader>
      {habits.map((h) => (
        <View key={h.id} style={{ marginBottom: 8 }}>
          <Text style={styles.text}>{h.name}</Text>
          <Text style={styles.text}>Current Streak: {h.currentStreak || 0}</Text>
          <Text style={styles.text}>Best Streak: {h.bestStreak || 0}</Text>
          <Text style={styles.text}>Adherence: {h.adherence || 0}%</Text>
        </View>
      ))}

      <SectionHeader>AI Feedback</SectionHeader>
      <Text style={styles.text}>{feedback}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  text: { color: colors.text },
});
