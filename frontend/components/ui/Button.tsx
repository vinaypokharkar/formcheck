import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '@/constants/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'icon';
  title?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Button = ({ variant = 'primary', title, icon, onPress, style, children }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isIcon = variant === 'icon';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isIcon && styles.icon,
        style,
      ]}
    >
      {isIcon ? (
        icon
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: Theme.radius.full,
  },
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: `${Theme.colors.outlineVariant}33`, // 20% opacity
  },
  icon: {
    backgroundColor: Theme.colors.surfaceContainerHigh,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: 48,
    height: 48,
    borderRadius: Theme.radius.full,
  },
  text: {
    fontFamily: Theme.typography.bodyMd.fontFamily,
    fontSize: Theme.typography.bodyMd.fontSize,
    lineHeight: Theme.typography.bodyMd.lineHeight,
    fontWeight: '600',
  },
  primaryText: {
    color: Theme.colors.onPrimary,
  },
  secondaryText: {
    color: Theme.colors.primary,
  },
});
