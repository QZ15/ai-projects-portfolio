import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { auth } from '../services/firebase';
import { saveUserProfile } from '../services/firebase';

const splits = [
  '5-day split',
  'Push/Pull/Legs',
  'Upper/Lower',
];

export default function SplitScreen({ route, navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Split'>) {
  const { weight, bodyFat, goal } = route.params;
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!auth.currentUser || !selected) return;
    setLoading(true);
    try {
      await saveUserProfile(auth.currentUser.uid, {
        weight,
        bodyFat,
        goal,
        split: selected,
      });
      navigation.getParent()?.navigate('Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Workout Split</Text>
      {splits.map((s) => (
        <TouchableOpacity
          key={s}
          style={[styles.option, selected === s && styles.selected]}
          onPress={() => setSelected(s)}
        >
          <Text style={styles.optionText}>{s}</Text>
        </TouchableOpacity>
      ))}
      {loading ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
      ) : (
        <Button title="Finish" onPress={handleFinish} disabled={!selected} />
      )}
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
