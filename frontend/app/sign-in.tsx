import React from 'react';
import { View, StyleSheet, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Typography variant="headlineLg" style={styles.logo}>
            FORMCHECK
          </Typography>
          <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.headerSubtitle}>
            PRECISION PERFORMANCE
          </Typography>
        </View>

        {/* FORM CONTAINER */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Typography variant="headlineLg" style={styles.title}>
              Welcome back
            </Typography>
            <Typography variant="bodyMd" color={Theme.colors.onSurfaceVariant} style={styles.subtitle}>
              Enter your credentials to continue
            </Typography>
          </View>

          <View style={styles.inputs}>
            <Input 
              label="EMAIL ADDRESS" 
              placeholder="name@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Input 
              label="PASSWORD" 
              rightLabel="FORGOT PASSWORD?"
              placeholder="••••••••"
              secureTextEntry
              style={{ marginBottom: 0 }} // Because container has bottom margin, override it for last item
            />
          </View>

          <Button 
            title="Sign In" 
            onPress={() => router.replace('/(tabs)')} 
            style={styles.signInBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.dividerText}>
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
                Sign in with Google
              </Typography>
            </View>
          </Button>

        </View>

        {/* FOOTER */}
        <Pressable onPress={() => router.replace('/sign-up')} style={styles.footer} hitSlop={12}>
          <Typography variant="bodyMd" color={Theme.colors.onSurfaceVariant}>
            Don't have an account? <Typography variant="bodyMd" color={Theme.colors.primary} style={{ fontWeight: 'bold' }}>Sign Up</Typography>
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
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    letterSpacing: 4,
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 8,
  },
  headerSubtitle: {
    letterSpacing: 2,
    fontSize: 10,
  },
  formCard: {
    width: '100%',
    backgroundColor: Theme.colors.surfaceContainer,
    borderRadius: Theme.radius.lg,
    padding: 24,
    paddingBottom: 32,
  },
  formHeader: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
  },
  inputs: {
    marginBottom: 32,
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
    alignItems: 'center',
  }
});
