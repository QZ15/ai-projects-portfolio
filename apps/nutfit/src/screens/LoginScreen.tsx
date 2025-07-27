import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { auth } from '../services/firebase';
import useAuth from '../hooks/useAuth';

export default function LoginScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.replace('Metrics');
    }
  }, [user]);

  const handlePress = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#ccc" />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} placeholderTextColor="#ccc" />
      <Button title={isSignup ? 'Sign Up' : 'Log In'} onPress={handlePress} />
      <Button title={isSignup ? 'Have an account? Log In' : 'Create Account'} onPress={() => setIsSignup(!isSignup)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    color: colors.text,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
