import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

export default function MetricsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Metrics'>) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [goal, setGoal] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Stats</Text>
        <TextInput
          placeholder="Current Weight (lbs)"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#ccc"
        />
        <TextInput
          placeholder="Body Fat %"
          value={bodyFat}
          onChangeText={setBodyFat}
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#ccc"
        />
        <TextInput
          placeholder="Goal (bulk/cut/maintain)"
          value={goal}
          onChangeText={setGoal}
          style={styles.input}
          placeholderTextColor="#ccc"
        />
        <Button
          title="Next"
          onPress={() => navigation.navigate('Split', { weight, bodyFat, goal })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  content: { flexGrow: 1, justifyContent: 'center' },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    color: '#fff',
  },
});
