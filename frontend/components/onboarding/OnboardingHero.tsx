import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Theme } from '@/constants/theme';

export function OnboardingHero() {
  return (
    <View style={styles.heroSection}>
      <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.overline}>
        REVOLUTIONIZING MOVEMENT
      </Typography>
      <Typography variant="displayLg" color={Theme.colors.primary} style={styles.title}>
        Precision in{'\n'}every rep
      </Typography>
      <Typography variant="bodyMd" color={Theme.colors.onSurfaceVariant} style={styles.description}>
        Real-time AI form analysis and movement correction. Engineered for those who demand technical mastery in every session.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: 24,
  },
  overline: {
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    marginBottom: 16,
    lineHeight: 48, // Tight line height for impact
  },
  description: {
    lineHeight: 24,
    paddingRight: 32, // Prevent full-width spanning for typography shaping
  },
});
