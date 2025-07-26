import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

export default function MetricsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Metrics'>) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [goal, setGoal] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <TextInput placeholder="Current Weight (kg)" value={weight} onChangeText={setWeight} style={styles.input} placeholderTextColor="#ccc" />
      <TextInput placeholder="Body Fat %" value={bodyFat} onChangeText={setBodyFat} style={styles.input} placeholderTextColor="#ccc" />
      <TextInput placeholder="Goal (bulk/cut/maintain)" value={goal} onChangeText={setGoal} style={styles.input} placeholderTextColor="#ccc" />
      <Button title="Next" onPress={() => navigation.navigate('Split', { weight, bodyFat, goal })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    justifyContent: 'center',
  },
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
