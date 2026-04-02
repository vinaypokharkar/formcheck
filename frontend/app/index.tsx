import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';

import { OnboardingHero } from '@/components/onboarding/OnboardingHero';
import { OnboardingCards } from '@/components/onboarding/OnboardingCards';
import { OnboardingActions } from '@/components/onboarding/OnboardingActions';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.header}>
          <Typography variant="headlineLg" style={styles.logo}>
            FORMCHECK
          </Typography>
          <View style={styles.statusDotOuter}>
            <View style={styles.statusDotInner} />
          </View>
        </View>

        <OnboardingHero />
        <OnboardingCards />
        <OnboardingActions />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 16, 
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    letterSpacing: 4,
    fontWeight: '700',
    fontSize: 18,
  },
  statusDotOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.onSurfaceVariant,
  },
});
