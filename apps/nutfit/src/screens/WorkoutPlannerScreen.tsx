import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Card } from '../components/ui';
import useAuth from '../hooks/useAuth';
import {
  getUserData,
  getWorkoutPlan,
  saveWorkoutPlan,
  callWorkoutFunction,
  addWorkoutLog,
} from '../services/firebase';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  muscleGroup: string;
  description?: string;
  equipment?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export default function WorkoutPlannerScreen() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [swapInfo, setSwapInfo] = useState<{ d: number; e: number } | null>(null);
  const [swapText, setSwapText] = useState('');

  const weekId = getWeekId();
  const today = new Date().getDay();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const stored = await getWorkoutPlan(user.uid, weekId);
        if (stored && stored.days) {
          setPlan(stored.days as WorkoutDay[]);
        } else {
          const data = await getUserData(user.uid);
          if (!data?.split) return;
          const generated = (await callWorkoutFunction('generateWorkoutPlan', {
            split: data.split,
          })) as WorkoutDay[];
          setPlan(generated);
          await saveWorkoutPlan(user.uid, weekId, { days: generated });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSwap = (d: number, e: number) => {
    setSwapInfo({ d, e });
    setSwapText(plan[d].exercises[e].name);
  };

  const saveSwap = async () => {
    if (!user || !swapInfo) return;
    const updated = [...plan];
    updated[swapInfo.d].exercises[swapInfo.e].name = swapText;
    setPlan(updated);
    setSwapInfo(null);
    await saveWorkoutPlan(user.uid, weekId, { days: updated });
  };

  const logExercise = async (d: number, e: number) => {
    if (!user) return;
    await addWorkoutLog(user.uid, weekId, {
      day: d,
      exercise: e,
      completedAt: Date.now(),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      {plan.map((day, dIdx) => (
        <Card
          key={day.day}
          style={[styles.dayCard, dIdx === today && styles.todayCard]}
        >
          <Text style={styles.dayTitle}>
            {dIdx === today ? "Today - " : ""}
            {day.day} ({day.focus})
          </Text>
          {day.exercises.map((ex, eIdx) => (
            <View key={eIdx} style={styles.exerciseRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {ex.sets} x {ex.reps} - Rest {ex.rest}
                </Text>
                {ex.description ? (
                  <Text style={styles.exerciseDesc}>{ex.description}</Text>
                ) : null}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleSwap(dIdx, eIdx)}>
                  <Text style={styles.swap}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logExercise(dIdx, eIdx)}>
                  <Text style={styles.complete}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>
      ))}
      <Modal visible={!!swapInfo} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Swap Exercise</Text>
            <TextInput
              value={swapText}
              onChangeText={setSwapText}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setSwapInfo(null)} />
              <Button title="Save" onPress={saveSwap} />
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

function getWeekId(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.text, fontSize: 18 },
  dayCard: { marginBottom: 16 },
  todayCard: { borderWidth: 1, borderColor: '#444' },
  dayTitle: { color: colors.text, fontSize: 18, marginBottom: 8 },
  exerciseRow: { flexDirection: 'row', marginBottom: 8 },
  exerciseName: { color: colors.text, fontSize: 16 },
  exerciseDetail: { color: '#ccc', fontSize: 14 },
  exerciseDesc: { color: '#888', fontSize: 12 },
  actions: { justifyContent: 'center', marginLeft: 8 },
  swap: { color: '#4af', marginBottom: 4 },
  complete: { color: '#5f5' },
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
  modalTitle: { color: colors.text, fontSize: 18, marginBottom: 8 },
  input: {
    backgroundColor: '#222',
    color: colors.text,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
