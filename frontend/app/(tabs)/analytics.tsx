import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui/Typography';
import { Theme } from '@/constants/theme';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="headlineLg">Analytics</Typography>
    </SafeAreaView>
  );
}
