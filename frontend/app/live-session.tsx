import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function LiveSessionScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isPaused, setIsPaused] = useState(false);

  // Re-check permission just in case, though it should be handled by the previous screen
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Typography variant="titleMd" style={{ color: '#FFF', textAlign: 'center' }}>
          Camera access is required for live tracking.
        </Typography>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      
      {/* CAMERA VIEW */}
      <CameraView style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.overlay} edges={['top']}>
          {/* TOP NAV BLUR (Optional based on design) */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
               <View style={styles.menuIcon}>
                 <MaterialCommunityIcons name="menu" size={24} color="#FFF" />
               </View>
               <Typography variant="headlineLg" style={styles.logo}>FormCheck</Typography>
            </View>
            <View style={styles.headerRight}>
               <View style={styles.liveBadge}>
                 <View style={styles.liveDot} />
                 <Typography variant="labelSm" style={{ color: '#FFF', fontWeight: '700' }}>LIVE</Typography>
               </View>
               <Pressable style={styles.plusBtn}>
                 <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
               </Pressable>
            </View>
          </View>

          {/* EXERCISE INFO */}
          <View style={styles.topInfoRow}>
            <View style={styles.exerciseInfoContainer}>
              <Typography variant="labelSm" style={styles.labelSmall}>CURRENT EXERCISE</Typography>
              <Typography variant="headlineLg" style={styles.exerciseName}>Dumbbell Press</Typography>
              <View style={styles.timeBadge}>
                <Typography variant="labelSm" style={styles.timeLabel}>TIME</Typography>
                <Typography variant="labelSm" style={styles.timeValue}>04:12</Typography>
              </View>
            </View>

            <View style={styles.formScoreContainer}>
              <View style={styles.formScoreCircle}>
                 <Typography variant="labelSm" style={styles.formLabel}>FORM</Typography>
                 <View style={styles.scoreValueContainer}>
                   <Typography variant="displayLg" style={styles.scoreValue}>95</Typography>
                   <Typography variant="labelSm" style={styles.percentage}>%</Typography>
                 </View>
              </View>
            </View>
          </View>

          {/* REPS OVERLAY */}
          <View style={styles.centerOverlay}>
            <Typography style={styles.repsCount}>12</Typography>
            <Typography variant="labelSm" style={styles.repsLabel}>REPS</Typography>
            
            {/* Visual Skeleton Placeholder (Visual only as requested per design) */}
            <View style={styles.skeletonLayer}>
               {/* Simple line skeleton mockup */}
               <View style={[styles.skeletonLine, { height: 100, transform: [{ rotate: '5deg' }] }]} />
               <View style={[styles.skeletonLine, { height: 120, left: 20, transform: [{ rotate: '-10deg' }] }]} />
            </View>
          </View>

          {/* FEEDBACK BADGES */}
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackLeft}>
               <View style={styles.statusBadge}>
                 <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
                 <Typography variant="labelSm" style={styles.statusText}>GOOD FORM</Typography>
               </View>
               <View style={[styles.statusBadge, styles.warningBadge]}>
                 <MaterialCommunityIcons name="alert" size={18} color="#FFF" />
                 <Typography variant="labelSm" style={styles.statusText}>GO LOWER</Typography>
               </View>
            </View>
            
            <View style={styles.alignmentContainer}>
              <View style={styles.alignmentCircle}>
                <MaterialCommunityIcons name="account-check" size={32} color="#FFF" />
                <Typography variant="labelSm" style={styles.alignmentText}>ALIGNED</Typography>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* BOTTOM CONTROLS */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleCameraFacing}>
            <MaterialCommunityIcons name="camera-flip" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playPauseBtn} 
            onPress={() => setIsPaused(!isPaused)}
          >
            <MaterialCommunityIcons 
              name={isPaused ? "play" : "pause"} 
              size={36} 
              color="#000" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.endSessionBtn}
            onPress={() => router.push('/')}
          >
            <Typography variant="labelLg" style={styles.endSessionText}>END SESSION</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="volume-high" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: '700',
    color: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4A4A',
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  exerciseInfoContainer: {
    flex: 1,
  },
  labelSmall: {
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  exerciseName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 28,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    marginTop: 12,
  },
  timeLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '700',
  },
  timeValue: {
    color: '#FFF',
    fontWeight: '700',
  },
  formScoreContainer: {
    alignItems: 'center',
  },
  formScoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    fontSize: 10,
    fontWeight: '700',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    color: '#FFF',
    fontWeight: '700',
  },
  percentage: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
  },
  centerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repsCount: {
    fontSize: 120,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.15)',
  },
  repsLabel: {
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 4,
    marginTop: -20,
    fontWeight: '700',
  },
  skeletonLayer: {
    position: 'absolute',
    opacity: 0.2,
  },
  skeletonLine: {
    width: 2,
    backgroundColor: '#FFF',
    position: 'absolute',
  },
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  feedbackLeft: {
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  warningBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  alignmentContainer: {
    alignItems: 'center',
  },
  alignmentCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  alignmentText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSessionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSessionText: {
    color: '#FFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
