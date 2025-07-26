import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './src/components/ui';

export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <RootNavigator />
    </ErrorBoundary>
  );
}
