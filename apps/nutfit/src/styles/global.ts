import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: colors.text,
    fontSize: 24,
    marginBottom: spacing.md,
  },
});
