import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlarmStore } from '../store/alarmStore';
import { silenceRingingAlarm } from '../alarms/scheduleAlarm';
import { usePoseTracking } from '../motion/usePoseTracking';
import { isPoseDetectorAvailable } from 'expo-pose-detector';
import { theme, numeralStyle } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutCamera'>;

// The actual shutoff gate is sustained movement, not a clean rep count —
// "movement, not perfect form" (see src/motion/README.md). Reps are shown
// for motivation/stats, but MOVING_MS_TO_COMPLETE is the real fallback so a
// groggy, sloppy set still silences the alarm.
const MOVING_MS_TO_COMPLETE = 25_000;

export function WorkoutCameraScreen({ route, navigation }: Props) {
  const { alarmId, requiredReps } = route.params;
  const alarm = useAlarmStore((s) => s.getAlarm(alarmId));
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [movingMs, setMovingMs] = useState(0);
  const [completing, setCompleting] = useState(false);
  const lastTickRef = useRef<number | null>(null);

  const tracking = usePoseTracking(cameraRef, alarm?.exerciseType ?? 'squat', Boolean(permission?.granted) && !completing);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted && permission.canAskAgain) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    const now = Date.now();
    if (tracking.isMoving) {
      if (lastTickRef.current !== null) {
        setMovingMs((ms) => ms + (now - lastTickRef.current!));
      }
      lastTickRef.current = now;
    } else {
      lastTickRef.current = null;
    }
  }, [tracking.isMoving, tracking.lastMetric]);

  const [manuallyCompleted, setManuallyCompleted] = useState(false);
  const done = movingMs >= MOVING_MS_TO_COMPLETE || tracking.reps >= requiredReps || manuallyCompleted;

  useEffect(() => {
    if (!done || completing || !alarm) return;
    setCompleting(true);
    silenceRingingAlarm(alarm).finally(() => {
      navigation.replace('WorkoutComplete', { alarmId, repsCompleted: tracking.reps });
    });
  }, [done, completing, alarm, alarmId, navigation, tracking.reps]);

  if (!alarm) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.statusText}>Alarm not found.</Text>
      </SafeAreaView>
    );
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.statusText}>Camera access is required to verify your workout.</Text>
      </SafeAreaView>
    );
  }

  const progress = Math.min(1, Math.max(movingMs / MOVING_MS_TO_COMPLETE, tracking.reps / requiredReps));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      <View style={styles.overlay}>
        <Text style={styles.exercise}>{alarm.exerciseType.replace('_', ' ').toUpperCase()}</Text>
        <Text style={[styles.repCount, numeralStyle]}>
          {tracking.reps}
          <Text style={styles.repTarget}> / {requiredReps}</Text>
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.status}>
          {!isPoseDetectorAvailable()
            ? 'Motion detection unavailable in this build (see RUNNING.md)'
            : !tracking.hasSeenPerson
              ? 'Step into frame...'
              : tracking.isMoving
                ? "Keep going — that's it"
                : 'Keep moving to silence the alarm'}
        </Text>

        {!isPoseDetectorAvailable() && (
          <Pressable style={styles.skipButton} onPress={() => setManuallyCompleted(true)}>
            <Text style={styles.skipButtonText}>Skip (dev) — preview Workout Complete</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.space(6),
    backgroundColor: 'rgba(11,11,15,0.85)',
    alignItems: 'center',
  },
  exercise: { color: theme.color.textSecondary, fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  repCount: { color: theme.color.win, fontSize: 56, marginTop: theme.space(1) },
  repTarget: { color: theme.color.textMuted, fontSize: 24 },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surfaceRaised,
    marginTop: theme.space(4),
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: theme.color.battle },
  status: { color: theme.color.textSecondary, marginTop: theme.space(3), fontSize: 14 },
  skipButton: {
    marginTop: theme.space(4),
    paddingVertical: theme.space(3),
    paddingHorizontal: theme.space(6),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  skipButtonText: { color: theme.color.win, fontSize: 13, fontWeight: '700' },
  statusText: { color: theme.color.textPrimary, textAlign: 'center', padding: theme.space(6) },
});
