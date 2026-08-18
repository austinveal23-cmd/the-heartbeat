import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlarmStore } from '../store/alarmStore';
import { armAlarm, silenceRingingAlarm } from '../alarms/scheduleAlarm';
import { requiredReps } from '../alarms/snoozeEscalation';
import { theme, numeralStyle } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlarmRinging'>;

const SNOOZE_MINUTES = 5;

function formatClock(): string {
  const now = new Date();
  const h12 = now.getHours() % 12 === 0 ? 12 : now.getHours() % 12;
  return `${h12}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function AlarmRingingScreen({ route, navigation }: Props) {
  const { alarmId } = route.params;
  const alarm = useAlarmStore((s) => s.getAlarm(alarmId));
  const [snoozeCount, setSnoozeCount] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (!alarm) {
    // Alarm was deleted, or the app cold-started straight into a stale deep
    // link. Nothing sensible to ring for.
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Alarm not found</Text>
        <Pressable style={styles.goButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.goButtonText}>Back to Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const reps = requiredReps(alarm.baseReps, snoozeCount);

  async function handleSnooze() {
    if (!alarm) return;
    const nextCount = snoozeCount + 1;
    setSnoozeCount(nextCount);
    await silenceRingingAlarm(alarm);

    const fireAt = new Date(Date.now() + SNOOZE_MINUTES * 60 * 1000);
    await armAlarm({
      id: `${alarm.id}-snooze`,
      hour: fireAt.getHours(),
      minute: fireAt.getMinutes(),
      repeatDays: [],
      label: alarm.label,
    });
    navigation.navigate('Home');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={[styles.clock, numeralStyle]}>{formatClock()}</Text>
        <Text style={styles.label}>{alarm.label || "Time to battle"}</Text>
        <Text style={styles.reps}>{reps} {alarm.exerciseType.replace('_', ' ')} to silence it</Text>

        <Pressable
          style={styles.goButton}
          onPress={() => navigation.replace('WorkoutCamera', { alarmId: alarm.id, requiredReps: reps })}
        >
          <Text style={styles.goButtonText}>GO BATTLE</Text>
        </Pressable>

        {alarm.snoozeEnabled && (
          <Pressable style={styles.snoozeButton} onPress={handleSnooze}>
            <Text style={styles.snoozeButtonText}>Snooze ({SNOOZE_MINUTES}m — costs you more reps)</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: theme.color.battle,
  },
  content: { alignItems: 'center', paddingHorizontal: theme.space(6) },
  clock: { color: theme.color.textPrimary, fontSize: 72 },
  title: { color: theme.color.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: theme.space(4) },
  label: { color: theme.color.textSecondary, fontSize: 16, marginTop: theme.space(2) },
  reps: { color: theme.color.win, fontSize: 15, fontWeight: '700', marginTop: theme.space(2), textTransform: 'capitalize' },
  goButton: {
    marginTop: theme.space(10),
    backgroundColor: theme.color.battle,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(5),
    paddingHorizontal: theme.space(14),
  },
  goButtonText: { color: theme.color.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  snoozeButton: { marginTop: theme.space(6), padding: theme.space(3) },
  snoozeButtonText: { color: theme.color.textMuted, fontSize: 13 },
});
