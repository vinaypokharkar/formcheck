import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { Theme } from '@/constants/theme';

interface TypographyProps {
  variant?: 'displayLg' | 'displayMd' | 'displaySm' | 'headlineLg' | 'titleLg' | 'titleMd' | 'bodyMd' | 'bodySm' | 'labelLg' | 'labelSm';
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Typography = ({ variant = 'bodyMd', color, style, children }: TypographyProps) => {
  const baseStyle = styles[variant];
  const dynamicColor = color || (variant.includes('body') ? Theme.colors.onSurfaceVariant : Theme.colors.primary);

  return (
    <Text style={[baseStyle, { color: dynamicColor }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  displayLg: {
    fontFamily: Theme.typography.displayLg.fontFamily,
    fontSize: Theme.typography.displayLg.fontSize,
    lineHeight: Theme.typography.displayLg.lineHeight,
  },
  displayMd: {
    fontFamily: Theme.typography.displayMd.fontFamily,
    fontSize: Theme.typography.displayMd.fontSize,
    lineHeight: Theme.typography.displayMd.lineHeight,
  },
  displaySm: {
    fontFamily: Theme.typography.displaySm.fontFamily,
    fontSize: Theme.typography.displaySm.fontSize,
    lineHeight: Theme.typography.displaySm.lineHeight,
  },
  headlineLg: {
    fontFamily: Theme.typography.headlineLg.fontFamily,
    fontSize: Theme.typography.headlineLg.fontSize,
    lineHeight: Theme.typography.headlineLg.lineHeight,
  },
  titleLg: {
    fontFamily: Theme.typography.titleLg.fontFamily,
    fontSize: Theme.typography.titleLg.fontSize,
    lineHeight: Theme.typography.titleLg.lineHeight,
  },
  titleMd: {
    fontFamily: Theme.typography.titleMd.fontFamily,
    fontSize: Theme.typography.titleMd.fontSize,
    lineHeight: Theme.typography.titleMd.lineHeight,
  },
  bodyMd: {
    fontFamily: Theme.typography.bodyMd.fontFamily,
    fontSize: Theme.typography.bodyMd.fontSize,
    lineHeight: Theme.typography.bodyMd.lineHeight,
  },
  bodySm: {
    fontFamily: Theme.typography.bodySm.fontFamily,
    fontSize: Theme.typography.bodySm.fontSize,
    lineHeight: Theme.typography.bodySm.lineHeight,
  },
  labelLg: {
    fontFamily: Theme.typography.labelLg.fontFamily,
    fontSize: Theme.typography.labelLg.fontSize,
    lineHeight: Theme.typography.labelLg.lineHeight,
  },
  labelSm: {
    fontFamily: Theme.typography.labelSm.fontFamily,
    fontSize: Theme.typography.labelSm.fontSize,
    lineHeight: Theme.typography.labelSm.lineHeight,
    textTransform: Theme.typography.labelSm.textTransform as any,
    letterSpacing: Theme.typography.labelSm.letterSpacing,
  },
});
