import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { Typography } from './Typography';
import { Theme } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  rightLabel?: string;
  onRightLabelPress?: () => void;
}

export function Input({ label, rightLabel, onRightLabelPress, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {(label || rightLabel) && (
        <View style={styles.labelContainer}>
          {label ? (
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant}>
              {label}
            </Typography>
          ) : <View />}
          
          {rightLabel && (
            <Pressable onPress={onRightLabelPress} hitSlop={8}>
              <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant}>
                {rightLabel}
              </Typography>
            </Pressable>
          )}
        </View>
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Theme.colors.outlineVariant}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0A0A0C', // Very dark near-black to contrast with surfaceContainer
    height: 56, // Modern tall input
    borderRadius: Theme.radius.md,
    paddingHorizontal: 16,
    color: Theme.colors.primary,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
  },
});
