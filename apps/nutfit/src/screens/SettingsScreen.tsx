import React from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { SectionHeader } from '../components/ui';
import { colors, spacing } from '../theme';

export default function SettingsScreen() {
  const [theme, setTheme] = React.useState(false);
  const [push, setPush] = React.useState(true);

  return (
    <View style={styles.container}>
      <SectionHeader>Settings</SectionHeader>
      <View style={styles.row}>
        <Text style={styles.text}>Dark Theme</Text>
        <Switch value={theme} onValueChange={setTheme} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Push Notifications</Text>
        <Switch value={push} onValueChange={setPush} />
      </View>
      <Button title="Log Out" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  text: { color: colors.text },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
});
