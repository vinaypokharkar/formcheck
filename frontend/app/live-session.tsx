import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// MediaPipe Pose Connections (indexes of body parts to connect)
const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
  [11, 23], [12, 24], [23, 24], // Torso
  [23, 25], [24, 26], [25, 27], [26, 28] // Legs
];

interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}
import { Theme } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Color palette
const COLORS = {
  // Monochrome base
  surface: '#080808',
  surfaceElevated: '#121214',
  surfaceHigh: '#1a1a1d',
  border: '#232323',
  borderHigh: '#2d2d2d',
  text: '#eaeaea',
  textMuted: '#78787a',
  textDisabled: '#444444',
  white: '#f5f5f5',

  // Performance indicators
  success: '#16c851',
  successDim: 'rgba(22, 200, 81, 0.12)',
  successBorder: 'rgba(22, 200, 81, 0.25)',

  warning: '#e2b815',
  warningDim: 'rgba(226, 184, 21, 0.12)',
  warningBorder: 'rgba(226, 184, 21, 0.25)',

  error: '#e62424',
  errorDim: 'rgba(230, 36, 36, 0.12)',
  errorBorder: 'rgba(230, 36, 36, 0.25)',

  live: '#e62424',
  liveDim: 'rgba(230, 36, 36, 0.15)',
};

export default function LiveSessionScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isPaused, setIsPaused] = useState(false);
  const cameraRef = React.useRef<any>(null);

  // LIVE DATA STATE
  const [reps, setReps] = useState(0);
  const [formScore, setFormScore] = useState(0);
  const [feedback, setFeedback] = useState('POSITIONING...');
  const [isGoodForm, setIsGoodForm] = useState(true);
  const [isAligned, setIsAligned] = useState(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  // Animation values
  const [scoreAnimation] = useState(new Animated.Value(1));
  const [repsAnimation] = useState(new Animated.Value(1));
  const prevScore = React.useRef(formScore);
  const prevReps = React.useRef(reps);

  useEffect(() => {
    if (formScore !== prevScore.current) {
      prevScore.current = formScore;
      Animated.sequence([
        Animated.timing(scoreAnimation, {
          toValue: 1.08,
          duration: 120,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scoreAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }

    if (reps !== prevReps.current) {
      prevReps.current = reps;
      Animated.sequence([
        Animated.timing(repsAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(repsAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [formScore, reps]);

  // WEBSOCKET LOGIC
  const WS_URL = 'https://three-pants-wash.loca.lt/ws/live-feed';

  useEffect(() => {
    let ws: WebSocket | null = null;
    let frameInterval: any = null;

    if (!isPaused && permission?.granted) {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('Connected to FormCheck Live Feed');

        // Start frame capture loop
        frameInterval = setInterval(async () => {
          if (cameraRef.current && ws?.readyState === WebSocket.OPEN) {
            try {
              const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.1,
                scale: 0.4,
                shutterSound: false,
                skipProcessing: true,
              });
              if (photo.base64) {
                ws.send(photo.base64);
              }
            } catch (err) {
               // Silently fail if camera is busy
            }
          }
        }, 150);
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.reps !== undefined) setReps(data.reps);
          if (data.score !== undefined) setFormScore(data.score);
          if (data.feedback !== undefined) setFeedback(data.feedback);
          if (data.landmarks !== undefined) setLandmarks(data.landmarks);

          // Use feedback to determine status UI
          setIsGoodForm(data.good_form ?? true);
          setIsAligned(data.aligned ?? false);
        } catch (err) {
          console.error('WS Message Error:', err);
        }
      };

      ws.onerror = (e: any) => {
        console.log('WS Error:', e.message || 'Connection failed');
      };

      ws.onclose = () => {
        console.log('Disconnected from Live Feed');
      };
    }

    return () => {
      if (ws) ws.close();
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isPaused, permission?.granted]);

  // Re-check permission just in case
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Typography variant="titleMd" style={{ color: COLORS.white, textAlign: 'center' }}>
          Camera access is required for live tracking.
        </Typography>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Helper function to get form score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 50) return COLORS.warning;
    return COLORS.error;
  };

  // Get feedback color
  const getFeedbackColor = () => {
    if (!isGoodForm) return 'error';
    return 'success';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {/* CAMERA VIEW */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

      {/* SKELETON OVERLAY */}
      {landmarks.length > 0 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Draw Joints */}
          {landmarks.map((lm, i) => {
            if (lm.visibility < 0.6 || (i > 0 && i < 11)) return null;
            const jointColor = getScoreColor(formScore);
            return (
              <View
                key={`joint-${i}`}
                style={{
                  position: 'absolute',
                  left: `${lm.x * 100}%`,
                  top: `${lm.y * 100}%`,
                  width: 8,
                  height: 8,
                  borderRadius: 0, // Square joints for brutalist feel
                  backgroundColor: COLORS.surface,
                  borderColor: jointColor,
                  borderWidth: 2,
                  transform: [{ translateX: -4 }, { translateY: -4 }],
                  zIndex: 10,
                }}
              />
            );
          })}

          {/* Connections */}
          {POSE_CONNECTIONS.map(([startIdx, endIdx], i) => {
             const start = landmarks[startIdx];
             const end = landmarks[endIdx];
             if (!start || !end || start.visibility < 0.5 || end.visibility < 0.5) return null;

             const dx = (end.x - start.x) * 100;
             const dy = (end.y - start.y) * 100;
             const length = Math.sqrt(dx * dx + dy * dy);
             const angle = Math.atan2(dy, dx) * (180 / Math.PI);

             return (
               <View
                 key={`bone-${i}`}
                 style={{
                   position: 'absolute',
                   left: `${start.x * 100}%`,
                   top: `${start.y * 100}%`,
                   width: `${length}%`,
                   height: 2,
                   backgroundColor: getScoreColor(formScore),
                   opacity: 0.5,
                   transform: [
                     { translateX: 0 },
                     { translateY: -1 },
                     { rotate: `${angle}deg` },
                   ],
                   transformOrigin: 'left',
                 }}
               />
             );
          })}
        </View>
      )}

      <SafeAreaView style={styles.overlayContainer} edges={['top']}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <View style={styles.logoMark} />
              <Typography variant="headlineLg" style={styles.logo}>FORMCHECK</Typography>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.livePulse}>
                <View style={[styles.liveDot, { backgroundColor: COLORS.live, opacity: isPaused ? 0.3 : 1 }]} />
                {!isPaused && <View style={[styles.livePulseOuter, { backgroundColor: COLORS.liveDim, opacity: isPaused ? 0 : 0.6 }]} />}
              </View>
              <Typography variant="labelSm" style={{ color: isPaused ? COLORS.textDisabled : COLORS.live, fontWeight: '700' }}>
                {isPaused ? 'PAUSED' : 'LIVE'}
              </Typography>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.plusBtn}>
              <MaterialCommunityIcons name="plus" size={20} color={COLORS.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* EXERCISE INFO */}
        <View style={styles.topInfoRow}>
          <View style={styles.exerciseInfoContainer}>
            <Typography variant="labelSm" style={styles.labelSmall}>EXERCISE</Typography>
            <Typography variant="headlineLg" style={styles.exerciseName}>DUMBBELL PRESS</Typography>
            <View style={styles.timeBadge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textMuted} />
              <Typography variant="labelSm" style={styles.timeValue}>04:12</Typography>
            </View>
          </View>

          <View style={styles.formScoreContainer}>
            <Animated.View style={[
              styles.formScoreCircle,
              {
                transform: [{ scale: scoreAnimation }],
                borderColor: getScoreColor(formScore),
              }
            ]}>
              <Typography variant="labelSm" style={[styles.formLabel, { color: getScoreColor(formScore) }]}>FORM</Typography>
              <View style={styles.scoreValueContainer}>
                <Typography variant="displayLg" style={[styles.scoreValue, { color: getScoreColor(formScore) }]}>{formScore}</Typography>
                <Typography variant="labelSm" style={[styles.percentage, { color: getScoreColor(formScore) }]}>%</Typography>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* REPS OVERLAY */}
        <View style={styles.centerOverlay}>
          <Animated.View style={{ transform: [{ scale: repsAnimation }] }}>
            <Typography style={styles.repsCount}>{reps}</Typography>
          </Animated.View>
          <Typography variant="labelSm" style={styles.repsLabel}>REPS</Typography>
        </View>

        {/* FEEDBACK */}
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackLeft}>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: isGoodForm ? COLORS.successDim : COLORS.errorDim,
                borderColor: isGoodForm ? COLORS.successBorder : COLORS.errorBorder,
              }
            ]}>
              <View style={[styles.statusDot, {
                backgroundColor: isGoodForm ? COLORS.success : COLORS.error,
              }]} />
              <Typography variant="labelSm" style={[styles.statusText, {
                color: isGoodForm ? COLORS.success : COLORS.error,
              }]}>{isGoodForm ? "GOOD FORM" : "RETRY FORM"}</Typography>
            </View>

            {feedback && feedback !== 'GOOD FORM' && (
              <View style={[styles.statusBadge, { backgroundColor: COLORS.errorDim, borderColor: COLORS.errorBorder }]}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.error }]} />
                <Typography variant="labelSm" style={[styles.statusText, { color: COLORS.error }]}>{feedback}</Typography>
              </View>
            )}
          </View>

          <View style={styles.alignmentContainer}>
            <View style={[styles.alignmentBox, {
              borderColor: isAligned ? COLORS.successBorder : COLORS.borderHigh,
              backgroundColor: isAligned ? COLORS.successDim : COLORS.surfaceHigh,
            }]}>
              <MaterialCommunityIcons name="account-check" size={20} color={isAligned ? COLORS.success : COLORS.textMuted} />
              <Typography variant="labelSm" style={[styles.alignmentText, {
                color: isAligned ? COLORS.success : COLORS.textMuted,
              }]}>{isAligned ? "ALIGNED" : "CENTER"}</Typography>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleCameraFacing}>
          <MaterialCommunityIcons name="camera-flip" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={() => setIsPaused(!isPaused)}
        >
          <MaterialCommunityIcons
            name={isPaused ? "play" : "pause"}
            size={24}
            color={COLORS.surface}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endSessionBtn}
          onPress={() => router.push('/')}
        >
          <MaterialCommunityIcons name="stop" size={16} color={COLORS.text} />
          <Typography variant="labelSm" style={styles.endSessionText}>END</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="volume-high" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 3,
    height: 24,
    backgroundColor: COLORS.white,
  },
  logo: {
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 0,
    gap: 8,
    backgroundColor: COLORS.liveDim,
    borderWidth: 0,
  },
  livePulse: {
    position: 'relative',
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 0,
  },
  livePulseOuter: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 0,
    opacity: 0.6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusBtn: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Top Info
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  exerciseInfoContainer: {
    flex: 1,
  },
  labelSmall: {
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  exerciseName: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0,
    gap: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeValue: {
    color: COLORS.text,
    fontWeight: '700',
  },
  formScoreContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  formScoreCircle: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  formLabel: {
    letterSpacing: 2,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  scoreValue: {
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: 36,
  },
  percentage: {
    color: COLORS.textMuted,
    fontWeight: '700',
    marginLeft: 1,
  },

  // Center
  centerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repsCount: {
    fontSize: 140,
    fontWeight: '900',
    color: COLORS.white,
    opacity: 0.1,
    lineHeight: 140,
    letterSpacing: -4,
  },
  repsLabel: {
    color: COLORS.textMuted,
    letterSpacing: 6,
    marginTop: -16,
    fontWeight: '700',
  },

  // Feedback
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 48,
  },
  feedbackLeft: {
    gap: 8,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    gap: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 0,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },
  alignmentContainer: {
    alignItems: 'flex-end',
  },
  alignmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 0,
  },
  alignmentText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: COLORS.surface,
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playPauseBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  endSessionBtn: {
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: 14,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    flexDirection: 'row',
  },
  endSessionText: {
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
