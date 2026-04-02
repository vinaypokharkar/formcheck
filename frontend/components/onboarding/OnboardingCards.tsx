import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';

export function OnboardingCards() {
  return (
    <View style={styles.mockupSection}>
      <Card style={styles.mainCard}>
        <View style={styles.cardHeader}>
          <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant}>
            REP CONSISTENCY
          </Typography>
          <View style={styles.liveIndicator} />
        </View>
        <Typography variant="displayLg" style={styles.metricBig}>
          98.4%
        </Typography>

        <View style={styles.cardRow}>
          {/* Dumbbell Icon Block */}
          <View style={styles.iconBlock}>
            <MaterialCommunityIcons name="dumbbell" size={24} color={Theme.colors.primary} />
          </View>
          {/* Symmetry Progress Block */}
          <View style={styles.symmetryBlock}>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ marginBottom: 8 }}>
              SYMMETRY CHECK
            </Typography>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
              <View style={styles.progressGap} />
              <View style={styles.progressFillSecondary} />
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.secondaryCard}>
        <View>
          <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant}>
            AI DETECTION
          </Typography>
          <Typography variant="bodyMd" color={Theme.colors.primary}>
            Neural Engine Active
          </Typography>
        </View>
        <IconSymbol name="waveform" size={24} color={Theme.colors.onSurfaceVariant} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  mockupSection: {
    marginBottom: 24,
    flex: 1, // Let it absorb any dynamic space in the middle to push content apart perfectly
    justifyContent: 'center',
  },
  mainCard: {
    marginBottom: 16,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
  },
  metricBig: {
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBlock: {
    width: 64,
    height: 64,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symmetryBlock: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.radius.md,
    padding: 16,
    justifyContent: 'center',
  },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    alignItems: 'center',
    gap: 4,
  },
  progressFill: {
    flex: 2,
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  progressGap: {
    flex: 1,
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  progressFillSecondary: {
    flex: 2,
    height: '100%',
    backgroundColor: '#303036',
    borderRadius: 2,
  },
  secondaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
});
