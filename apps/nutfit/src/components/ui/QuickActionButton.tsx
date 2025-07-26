import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors, radius, spacing } from '../../theme';

interface Props extends TouchableOpacityProps {
  title: string;
}

function QuickActionButton({ title, style, ...props }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      style={[styles.button, style]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(QuickActionButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  text: { color: colors.text, textAlign: 'center' },
});
