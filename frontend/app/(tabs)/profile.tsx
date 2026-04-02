import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui/Typography';
import { Theme } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="headlineLg">Profile</Typography>
    </SafeAreaView>
  );
}
