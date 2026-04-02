import React from 'react';
import { View, StyleSheet, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Typography variant="headlineLg" style={styles.logo}>
              FormCheck
            </Typography>
            <View style={styles.logoLine} />
          </View>
          
          <View style={styles.heroTextContainer}>
            <Typography variant="displayLg" style={styles.heroTextTop}>
              Start your
            </Typography>
            <Typography variant="displayLg" color={Theme.colors.onSurfaceVariant} style={styles.heroTextBottom}>
              precision journey.
            </Typography>
          </View>
        </View>

        {/* INPUTS */}
        <View style={styles.inputs}>
          <Input 
            label="FULL NAME" 
            placeholder="John Doe"
            autoCapitalize="words"
          />

          <Input 
            label="EMAIL ADDRESS" 
            placeholder="name@domain.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Input 
            label="PASSWORD" 
            placeholder="••••••••"
            secureTextEntry
            style={{ marginBottom: 0 }} 
          />
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsContainer}>
          <Button 
            title="Create Account" 
            onPress={() => router.replace('/(tabs)')} 
            style={styles.signInBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Typography variant="labelSm" color={Theme.colors.outlineVariant} style={styles.dividerText}>
              OR
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <Button 
            variant="secondary"
            onPress={() => router.replace('/(tabs)')} 
            style={styles.googleBtn}
          >
            <View style={styles.googleBtnContent}>
              <MaterialCommunityIcons name="google" size={20} color={Theme.colors.primary} />
              <Typography variant="bodyMd" color={Theme.colors.primary} style={{ fontWeight: '600' }}>
                Sign up with Google
              </Typography>
            </View>
          </Button>
        </View>

        {/* FOOTER */}
        <Pressable onPress={() => router.replace('/sign-in')} style={styles.footer} hitSlop={12}>
          <Typography variant="bodyMd" color={Theme.colors.onSurfaceVariant}>
            Already have an account? <Typography variant="bodyMd" color={Theme.colors.primary} style={{ fontWeight: 'bold' }}>Sign In</Typography>
          </Typography>
        </Pressable>
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 12,
  },
  logoLine: {
    height: 3,
    width: 32,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  heroTextContainer: {
    alignItems: 'center', 
    width: '100%',
  },
  heroTextTop: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    alignSelf: 'center', // ensures it spans to apply text align correctly
  },
  heroTextBottom: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    alignSelf: 'center',
  },
  inputs: {
    marginBottom: 32,
  },
  actionsContainer: {
    width: '100%',
  },
  signInBtn: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.surfaceContainerHighest,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    marginTop: 'auto',
    alignSelf: 'center',
  }
});
