// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "../navigation/OnboardingNavigator";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import useAuth from "../hooks/useAuth";

type LoginProps = NativeStackScreenProps<OnboardingStackParamList, "Login">;

export default function LoginScreen({}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useAuth(); // keep auth state live; RootNavigator handles routing

  const handleAuth = async () => {
    try {
      setLoading(true);
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // No popups, no manual navigation
    } catch (e: any) {
      setError(e?.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View className="mt-16 mb-8 items-center">
            <Text className="text-white text-[28px] font-bold">
              {isSignup ? "Create Account" : "Welcome Back"}
            </Text>
            <Text className="text-gray-400 mt-2">
              {isSignup ? "Sign up to get started" : "Log in to continue"}
            </Text>
          </View>

          {!!error && (
            <View className="bg-red-900/30 border border-red-700 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-red-300 text-sm">{error}</Text>
            </View>
          )}

          <Text className="text-gray-400 text-sm mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-4 border border-neutral-800"
          />

          <Text className="text-gray-400 text-sm mb-1">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            secureTextEntry
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-6 border border-neutral-800"
          />

          <TouchableOpacity
            onPress={handleAuth}
            disabled={loading}
            className="bg-blue-500 py-4 rounded-2xl items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">
                {isSignup ? "Sign Up" : "Log In"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup((v) => !v)} className="mt-4">
            <Text className="text-gray-400 text-center">
              {isSignup ? "Already have an account? Log In" : "Don’t have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
