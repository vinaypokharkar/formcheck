import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  nested?: boolean;
}

export const Card = ({ children, style, nested = false }: CardProps) => {
  return (
    <View style={[styles.card, nested ? styles.nested : styles.main, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Theme.spacing.base, // default inner padding Spacing 8
  },
  main: {
    backgroundColor: Theme.colors.surfaceContainer,
    borderRadius: Theme.radius.lg,
  },
  nested: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.tight, // tighter padding for nested
  },
});
