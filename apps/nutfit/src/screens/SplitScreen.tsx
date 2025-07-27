import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const splits = [
  '5-day split',
  'Push/Pull/Legs',
  'Upper/Lower',
];

export default function SplitScreen({ route, navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Split'>) {
  const { weight, bodyFat, goal } = route.params;
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!auth.currentUser || !selected) return;
    setSaving(true);
    const ref = doc(db, 'users', auth.currentUser.uid);
    await setDoc(ref, {
      weight,
      bodyFat,
      goal,
      split: selected,
      hasOnboarded: true,
    });
    setSaving(false);
    navigation.getParent()?.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Workout Split</Text>
      {splits.map((s) => (
        <TouchableOpacity key={s} style={[styles.option, selected === s && styles.selected]} onPress={() => setSelected(s)}>
          <Text style={styles.optionText}>{s}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Finish" onPress={handleFinish} disabled={!selected || saving} />
      {saving && <ActivityIndicator color="#fff" style={{ marginTop: 12 }} />}
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
  title: {
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#333',
  },
  optionText: {
    color: colors.text,
    textAlign: 'center',
  },
});
