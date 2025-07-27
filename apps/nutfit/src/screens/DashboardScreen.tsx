import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import useAuth from '../hooks/useAuth';
import { getUserData } from '../services/firebase';
import { Card, QuickActionButton } from '../components/ui';

type UserData = {
  weight?: string;
  goal?: string;
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
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

  const displayName = user?.email?.split('@')[0] ?? 'User';

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Welcome back, {displayName}!</Text>

      <Card>
        <Text style={styles.cardTitle}>Today's Summary</Text>
        <Text style={styles.stat}>Calories Consumed: 2000</Text>
        <Text style={styles.stat}>Calories Burned: 500</Text>
        <Text style={styles.stat}>Current Weight: {data?.weight ?? '--'} lbs</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <QuickActionButton title="View Today’s Meal Plan" onPress={() => navigation.navigate('Meals')} />
        <QuickActionButton title="Start Workout" onPress={() => navigation.navigate('Workouts')} />
        <QuickActionButton title="Check Progress" onPress={() => navigation.navigate('Progress')} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Upcoming Reminders</Text>
        <Text style={styles.reminder}>Meal @ 12:00 PM</Text>
        <Text style={styles.reminder}>Workout @ 6:30 PM</Text>
      </Card>
      </ScrollView>
    </SafeAreaView>
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
