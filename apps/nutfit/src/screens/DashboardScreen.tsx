import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../theme';
import { globalStyles } from '../styles/global';
import useAuth from '../hooks/useAuth';
import { getUserData } from '../services/firebase';
import { Card, QuickActionButton } from '../components/ui';

type UserData = {
  weight?: string;
  goal?: string;
  name?: string;
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((d) => setData(d))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const name = data?.name ?? 'User';

  if (loading) {
    return (
      <View style={[globalStyles.screen, styles.center]}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Welcome back, {name}!</Text>

      <Card>
        <Text style={styles.cardTitle}>Today's Summary</Text>
        <Text style={styles.stat}>Calories Consumed: 2000</Text>
        <Text style={styles.stat}>Calories Burned: 500</Text>
        <Text style={styles.stat}>Current Weight: {data?.weight ?? '--'} lbs</Text>
        <Text style={styles.stat}>Goal: {data?.goal ?? '--'}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.md },
  header: { color: colors.text, fontSize: 24, marginBottom: spacing.md },
  cardTitle: { color: colors.text, fontSize: 18, marginBottom: spacing.sm },
  stat: { color: colors.text, marginBottom: spacing.xs },
  reminder: { color: colors.text, marginBottom: spacing.xs },
});
