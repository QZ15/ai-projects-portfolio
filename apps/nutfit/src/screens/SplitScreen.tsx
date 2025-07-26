import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
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

  const handleFinish = async () => {
    if (!auth.currentUser) return;
    const ref = doc(db, 'users', auth.currentUser.uid);
    await setDoc(ref, {
      weight,
      bodyFat,
      goal,
      split: selected,
    });
    navigation.getParent()?.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Workout Split</Text>
      {splits.map((s) => (
        <TouchableOpacity key={s} style={[styles.option, selected === s && styles.selected]} onPress={() => setSelected(s)}>
          <Text style={styles.optionText}>{s}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Finish" onPress={handleFinish} disabled={!selected} />
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
    color: '#fff',
    textAlign: 'center',
  },
});
