import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useAuth from '../hooks/useAuth';
import { getUserData } from '../services/firebase';
import Card from '../components/Card';
import QuickActionButton from '../components/QuickActionButton';

type UserData = {
  weight?: string;
  goal?: string;
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((d) => setData(d));
    }
  }, [user]);

  const nameOrGoal = data?.goal ?? 'User';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Welcome back, {nameOrGoal}!</Text>

      <Card>
        <Text style={styles.cardTitle}>Today's Summary</Text>
        <Text style={styles.stat}>Calories Consumed: 2000</Text>
        <Text style={styles.stat}>Calories Burned: 500</Text>
        <Text style={styles.stat}>Current Weight: {data?.weight ?? '--'} lbs</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <QuickActionButton title="View Today’s Meal Plan" />
        <QuickActionButton title="Start Workout" />
        <QuickActionButton title="Check Progress" />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Upcoming Reminders</Text>
        <Text style={styles.reminder}>Meal @ 12:00 PM</Text>
        <Text style={styles.reminder}>Workout @ 6:30 PM</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16 },
  header: { color: '#fff', fontSize: 24, marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 18, marginBottom: 8 },
  stat: { color: '#fff', marginBottom: 4 },
  reminder: { color: '#fff', marginBottom: 4 },
});
