import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { Card, QuickActionButton } from '../components/ui';
import useAuth from '../hooks/useAuth';
import {
  callMealFunction,
  addMealHistory,
  saveMeal,
} from '../services/firebase';

type MacroBreakdown = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

interface Ingredient {
  name: string;
  quantity: string;
}

interface Meal {
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  macros: MacroBreakdown;
  photoUrl?: string;
}

type Mode = 'generate' | 'ingredients' | 'photo';

export default function MealPlanner() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('generate');
  const [ingredients, setIngredients] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  const appendMeal = async (meal: Meal) => {
    setMeals((m) => [meal, ...m]);
    if (user) await addMealHistory(user.uid, meal);
  };

  const generateMeal = async () => {
    setLoading(true);
    try {
      const data = (await callMealFunction('generateMealPlan', {})) as Meal;
      await appendMeal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateFromIngredients = async () => {
    setLoading(true);
    try {
      const list = ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const data = (await callMealFunction('generateMealFromIngredients', {
        ingredients: list,
      })) as Meal;
      await appendMeal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const estimateFromPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const img = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (img.canceled) return;
    setLoading(true);
    try {
      const data = (await callMealFunction('estimateMealFromPhoto', {
        imageUri: img.assets[0].uri,
      })) as Meal;
      data.photoUrl = img.assets[0].uri;
      await appendMeal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (meal: Meal) => {
    if (!user) return;
    await saveMeal(user.uid, meal);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.toggleRow}>
        <QuickActionButton title="AI Meal" onPress={() => setMode('generate')} />
        <QuickActionButton
          title="My Ingredients"
          onPress={() => setMode('ingredients')}
        />
        <QuickActionButton title="Photo" onPress={() => setMode('photo')} />
      </View>

      {mode === 'generate' && (
        <QuickActionButton
          title="Generate Meal Plan"
          onPress={generateMeal}
        />
      )}

      {mode === 'ingredients' && (
        <View>
          <TextInput
            placeholder="Enter ingredients (comma separated)"
            placeholderTextColor="#888"
            style={styles.input}
            value={ingredients}
            onChangeText={setIngredients}
          />
          <QuickActionButton
            title="Generate With My Ingredients"
            onPress={generateFromIngredients}
          />
        </View>
      )}

      {mode === 'photo' && (
        <QuickActionButton title="Estimate From Photo" onPress={estimateFromPhoto} />
      )}

      {loading && <ActivityIndicator color="#fff" style={{ marginVertical: 16 }} />}

      {meals.map((meal, idx) => (
        <Card key={idx} style={styles.mealCard}>
          {meal.photoUrl && (
            <Image
              source={{ uri: meal.photoUrl }}
              style={styles.mealImage}
            />
          )}
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {meal.ingredients.map((ing, i) => (
            <Text key={i} style={styles.ingredient}>
              {ing.quantity} {ing.name}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Macros</Text>
          <Text style={styles.macro}>Calories: {meal.macros.calories}</Text>
          <Text style={styles.macro}>Protein: {meal.macros.protein}g</Text>
          <Text style={styles.macro}>Carbs: {meal.macros.carbs}g</Text>
          <Text style={styles.macro}>Fats: {meal.macros.fats}g</Text>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{meal.instructions}</Text>
          <QuickActionButton
            title="❤️ Save to Favorites"
            onPress={() => handleSave(meal)}
          />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  mealCard: { marginBottom: spacing.md },
  mealImage: { height: 200, borderRadius: radius.md, marginBottom: spacing.sm },
  mealName: { color: colors.text, fontSize: 18, marginBottom: spacing.sm },
  sectionTitle: { color: colors.text, fontSize: 16, marginTop: spacing.sm },
  ingredient: { color: colors.text, marginLeft: spacing.sm },
  macro: { color: colors.text, marginLeft: spacing.sm },
  instructions: { color: colors.text, marginTop: spacing.xs },
});
