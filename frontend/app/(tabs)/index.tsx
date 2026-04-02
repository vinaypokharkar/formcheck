import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header onProfilePress={() => router.push('/profile')} />

        {/* ACTIVE SESSION CARD */}
        <View style={styles.activeSessionCard}>
          <View style={styles.cardTop}>
             <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ letterSpacing: 1, fontSize: 10 }}>
               ACTIVE SESSION
             </Typography>
             <View style={styles.liveBadge}>
               <View style={styles.liveDot} />
               <Typography variant="labelSm" style={{ fontSize: 10, fontWeight: '700' }}>
                 LIVE
               </Typography>
             </View>
          </View>
          <Typography variant="headlineLg" style={{ fontWeight: '700', marginTop: 8 }}>
            Barbell Back Squat
          </Typography>

          {/* Spacer for video/graph placeholder */}
          <View style={{ height: 120 }} />

          <View style={styles.activeSessionBottom}>
             <View style={styles.sessionStats}>
                <View>
                  <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>ELAPSED</Typography>
                  <Typography variant="displaySm" style={{ fontWeight: '700' }}>24:12</Typography>
                </View>
                <View style={{ marginLeft: 24 }}>
                  <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>SCORE</Typography>
                  <Typography variant="displaySm" style={{ fontWeight: '700' }}>98%</Typography>
                </View>
             </View>
             <Pressable style={styles.endSessionBtn}>
               <Typography variant="labelLg" style={{ color: Theme.colors.surface, fontWeight: '600' }}>End Session</Typography>
             </Pressable>
          </View>
        </View>

        {/* MIDDLE ROW */}
        <View style={styles.row}>
          {/* DAILY REPS */}
          <View style={[styles.squareCard, { flex: 1, marginRight: 8 }]}>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ letterSpacing: 1, fontSize: 10 }}>DAILY REPS</Typography>
            <Typography variant="displayMd" style={{ fontWeight: '700', marginTop: 12 }}>428</Typography>

            <View style={{ marginTop: 'auto' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ fontSize: 9 }}>TARGET</Typography>
                <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ fontSize: 9 }}>85%</Typography>
              </View>
              <View style={styles.progressBarBg}>
                 <View style={[styles.progressBarFill, { width: '85%' }]} />
              </View>
            </View>
          </View>

          {/* INTENSITY */}
          <View style={[styles.squareCard, { flex: 1, marginLeft: 8 }]}>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ letterSpacing: 1, fontSize: 10 }}>INTENSITY</Typography>
            <View style={styles.barChart}>
               <View style={[styles.bar, { height: '30%' }]} />
               <View style={[styles.bar, { height: '60%' }]} />
               <View style={[styles.bar, { height: '15%' }]} />
               <View style={[styles.bar, { height: '100%', backgroundColor: Theme.colors.primary }]} />
               <View style={[styles.bar, { height: '10%' }]} />
               <View style={[styles.bar, { height: '10%' }]} />
               <View style={[styles.bar, { height: '10%' }]} />
            </View>
          </View>
        </View>

        {/* BOTTOM ROW */}
        <View style={styles.row}>
          {/* AI ANALYSIS */}
          <View style={[styles.squareCard, { flex: 1, marginRight: 8, backgroundColor: Theme.colors.primary }]}>
            <Typography variant="titleLg" style={{ color: Theme.colors.surface, fontWeight: '700' }}>AI Analysis</Typography>
            <Typography variant="bodySm" style={{ color: Theme.colors.surfaceVariant, marginTop: 4 }}>Real-time correction.</Typography>
            <View style={{ marginTop: 'auto' }}>
              <View style={styles.aiIconBtn}>
                <MaterialCommunityIcons name="video" size={20} color={Theme.colors.surface} />
              </View>
            </View>
          </View>

          {/* LAST SESSION */}
          <View style={[styles.squareCard, { flex: 1, marginLeft: 8 }]}>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ letterSpacing: 1, fontSize: 10 }}>LAST SESSION</Typography>
            <View style={{ marginTop: 24 }}>
              <Typography variant="titleMd" style={{ fontWeight: '700' }}>Hypertrophy B</Typography>
              <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ marginTop: 4 }}>+12% PR</Typography>
            </View>
            <View style={{ marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <MaterialCommunityIcons name="dumbbell" size={12} color={Theme.colors.onSurfaceVariant} />
               <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={{ fontSize: 10 }}>Yesterday</Typography>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  activeSessionCard: {
    backgroundColor: Theme.colors.surfaceContainer,
    borderRadius: Theme.radius.lg,
    padding: 24,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4A4A',
  },
  activeSessionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sessionStats: {
    flexDirection: 'row',
  },
  endSessionBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  squareCard: {
    backgroundColor: Theme.colors.surfaceContainer,
    borderRadius: Theme.radius.lg,
    padding: 20,
    aspectRatio: 0.9,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Theme.colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  barChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  bar: {
    width: '10%',
    backgroundColor: Theme.colors.surfaceContainerHighest,
    borderRadius: 2,
  },
  aiIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
