import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, radius, spacing } from '../../theme';

function Card({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

export default React.memo(Card);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
});
