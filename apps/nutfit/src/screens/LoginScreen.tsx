import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
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
  const { user, onboarded } = useAuth();

  useEffect(() => {
    if (user && onboarded) {
      navigation.getParent()?.navigate('Main');
    } else if (user) {
      navigation.replace('Metrics');
    }
  }, [user, onboarded]);

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
    <View style={styles.container}>
      <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#ccc" />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} placeholderTextColor="#ccc" />
      <Button title={isSignup ? 'Sign Up' : 'Log In'} onPress={handlePress} />
      <Button title={isSignup ? 'Have an account? Log In' : 'Create Account'} onPress={() => setIsSignup(!isSignup)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
