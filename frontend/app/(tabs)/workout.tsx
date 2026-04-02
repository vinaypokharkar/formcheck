import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Image paths - using the generated assets
const ASSETS = {
  squats: require('@/assets/images/squats.png'), // These should be moved to assets/images
  pushups: require('@/assets/images/pushups.png'),
  curls: require('@/assets/images/curls.png'),
  jumpingJacks: require('@/assets/images/jumping-jacks.png'),
};

import { Camera } from 'expo-camera';
import { Alert, Linking } from 'react-native';

const EXERCISES = [
  { id: '1', name: 'Squats', image: ASSETS.squats },
  { id: '2', name: 'Push-ups', image: ASSETS.pushups },
  { id: '3', name: 'Bicep Curls', image: ASSETS.curls },
  { id: '4', name: 'Jumping Jacks', image: ASSETS.jumpingJacks },
];

export default function WorkoutScreen() {
  const router = useRouter();
  const [sessionMode, setSessionMode] = useState<'live' | 'record'>('live');
  const [selectedExercise, setSelectedExercise] = useState('1');

  const handleStartWorkout = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    
    if (status === 'granted') {
      router.push('/live-session');
    } else {
      Alert.alert(
        'Camera Permission Required',
        'FormCheck needs camera access to analyze your form in real-time. Please enable it in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header onProfilePress={() => router.push('/profile')} />

        <View style={styles.container}>
          {/* PREPARATION SECTION */}
          <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.sectionLabel}>
            PREPARATION
          </Typography>
          <Typography variant="headlineLg" style={styles.pageTitle}>
            Setup Your Session
          </Typography>

          {/* Environmental Setup Card */}
          <View style={styles.setupCard}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="lightbulb" size={24} color="#FFF" />
            </View>
            <View style={styles.setupText}>
              <Typography variant="titleMd" style={{ fontWeight: '700' }}>Environmental Setup</Typography>
              <Typography variant="bodySm" color={Theme.colors.onSurfaceVariant}>
                Ensure full body visibility in high contrast lighting for 99.8% accuracy.
              </Typography>
            </View>
          </View>

          {/* WORKOUT MODE */}
          <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.sectionLabel}>
            WORKOUT MODE
          </Typography>
          <View style={styles.modeRow}>
            <Pressable 
              onPress={() => setSessionMode('live')}
              style={[styles.modeBtn, sessionMode === 'live' && styles.modeBtnActive]}
            >
              <View style={[styles.modeIconBg, sessionMode === 'live' && styles.modeIconBgActive]}>
                <MaterialCommunityIcons 
                  name="broadcast" 
                  size={20} 
                  color={sessionMode === 'live' ? Theme.colors.surface : '#FFF'} 
                />
              </View>
              <View>
                <Typography 
                  variant="labelLg" 
                  style={{ color: sessionMode === 'live' ? Theme.colors.surface : '#FFF', fontWeight: '700' }}
                >
                  Live AI
                </Typography>
                <Typography 
                  variant="labelSm" 
                  style={{ color: sessionMode === 'live' ? Theme.colors.surface : Theme.colors.onSurfaceVariant }}
                >
                  REAL-TIME
                </Typography>
              </View>
              {sessionMode === 'live' && <View style={styles.activeDot} />}
            </Pressable>

            <Pressable 
              onPress={() => setSessionMode('record')}
              style={[styles.modeBtn, sessionMode === 'record' && styles.modeBtnActive]}
            >
              <View style={[styles.modeIconBg, sessionMode === 'record' && styles.modeIconBgActive]}>
                <MaterialCommunityIcons 
                  name="video" 
                  size={20} 
                  color={sessionMode === 'record' ? Theme.colors.surface : '#FFF'} 
                />
              </View>
              <View>
                <Typography 
                  variant="labelLg" 
                  style={{ color: sessionMode === 'record' ? Theme.colors.surface : '#FFF', fontWeight: '700' }}
                >
                  Record
                </Typography>
                <Typography 
                  variant="labelSm" 
                  style={{ color: sessionMode === 'record' ? Theme.colors.surface : Theme.colors.onSurfaceVariant }}
                >
                  POST-ANALYZ
                </Typography>
              </View>
            </Pressable>
          </View>

          {/* SELECT EXERCISE */}
          <View style={styles.exerciseHeader}>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant} style={styles.sectionLabel}>
              SELECT EXERCISE
            </Typography>
            <Typography variant="labelSm" color={Theme.colors.onSurfaceVariant}>
              4 available
            </Typography>
          </View>

          <View style={styles.exerciseGrid}>
            {EXERCISES.map((ex) => (
              <Pressable 
                key={ex.id}
                onPress={() => setSelectedExercise(ex.id)}
                style={[styles.exerciseCard, selectedExercise === ex.id && styles.exerciseCardActive]}
              >
                <ImageBackground 
                  source={ex.image} 
                  style={styles.exerciseBg}
                  imageStyle={{ borderRadius: 28 }}
                >
                  <View style={styles.exerciseOverlay}>
                    {selectedExercise === ex.id && (
                      <View style={styles.checkIcon}>
                        <MaterialCommunityIcons name="check-circle" size={24} color="#FFF" />
                      </View>
                    )}
                    <Typography variant="titleMd" style={styles.exerciseName}>{ex.name}</Typography>
                  </View>
                </ImageBackground>
              </Pressable>
            ))}
          </View>

          {/* START WORKOUT BUTTON */}
          <Pressable style={styles.startBtn} onPress={handleStartWorkout}>
            <Typography variant="titleLg" style={styles.startBtnText}>START WORKOUT</Typography>
          </Pressable>

          <Typography variant="labelSm" style={styles.bottomLink}>
            AI CALIBRATION WILL BEGIN ON START
          </Typography>
        </View>
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
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
  },
  sectionLabel: {
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  pageTitle: {
    fontWeight: '700',
    marginBottom: 24,
  },
  setupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 32,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupText: {
    flex: 1,
    marginLeft: 16,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    padding: 12,
    gap: 12,
  },
  modeBtnActive: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  modeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconBgActive: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9E9E9E',
    position: 'absolute',
    right: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  exerciseCard: {
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 32,
    overflow: 'hidden',
  },
  exerciseCardActive: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  exerciseBg: {
    flex: 1,
  },
  exerciseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  exerciseName: {
    fontWeight: '700',
    color: '#FFF',
  },
  startBtn: {
    backgroundColor: '#FFF',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  startBtnText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1,
  },
  bottomLink: {
    textAlign: 'center',
    color: Theme.colors.onSurfaceVariant,
    letterSpacing: 1,
  },
});
