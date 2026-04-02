import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Theme } from '@/constants/theme';

export function OnboardingActions() {
  const router = useRouter();

  return (
    <View style={styles.bottomSection}>
      <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.bottomDescription}>
        Our proprietary computer vision models analyze your movement through the device camera. Zero wearable hardware required. All processing happens locally on your device for total privacy.
      </Typography>

      <Button 
        title="Get Started" 
        onPress={() => router.push('/sign-up')} 
        style={styles.btnPrimary}
      />
      <Button 
        title="Existing User" 
        variant="secondary" 
        onPress={() => router.push('/sign-in')} 
        style={styles.btnSecondary}
      />

      
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    gap: 16,
    justifyContent: 'flex-end',
  },
  bottomDescription: {
    lineHeight: 20,
    marginBottom: 8,
  },
  btnPrimary: {
    width: '100%',
  },
  btnSecondary: {
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 9,
    letterSpacing: 2,
  },
});
