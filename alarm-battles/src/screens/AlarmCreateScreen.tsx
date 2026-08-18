import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlarmStore, type Alarm } from '../store/alarmStore';
import { theme } from '../theme/theme';
import { generateId } from '../lib/id';
import { TimePickerField } from '../components/TimePickerField';
import type { ExerciseType } from '../types/exercise';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlarmCreate'>;

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const EXERCISES: { type: ExerciseType; label: string }[] = [
  { type: 'squat', label: 'Squats' },
  { type: 'pushup', label: 'Push-Ups' },
  { type: 'jumping_jack', label: 'Jumping Jacks' },
];

function defaultAlarm(): Alarm {
  const now = new Date();
  return {
    id: generateId(),
    hour: now.getHours(),
    minute: (now.getMinutes() + 1) % 60,
    repeatDays: [1, 2, 3, 4, 5],
    label: '',
    exerciseType: 'squat',
    baseReps: 15,
    snoozeEnabled: true,
    active: true,
  };
}

export function AlarmCreateScreen({ route, navigation }: Props) {
  const alarmId = route.params?.alarmId;
  const existing = useAlarmStore((s) => (alarmId ? s.getAlarm(alarmId) : undefined));
  const upsertAlarm = useAlarmStore((s) => s.upsertAlarm);
  const removeAlarm = useAlarmStore((s) => s.removeAlarm);

  const [alarm, setAlarm] = useState<Alarm>(() => existing ?? defaultAlarm());
  const isEditing = useMemo(() => Boolean(existing), [existing]);

  function toggleDay(day: number) {
    setAlarm((a) => ({
      ...a,
      repeatDays: a.repeatDays.includes(day) ? a.repeatDays.filter((d) => d !== day) : [...a.repeatDays, day].sort(),
    }));
  }

  async function save() {
    await upsertAlarm(alarm);
    navigation.goBack();
  }

  async function remove() {
    if (!existing) return;
    await removeAlarm(existing.id);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>{isEditing ? 'Edit Alarm' : 'New Alarm'}</Text>

        <TimePickerField hour={alarm.hour} minute={alarm.minute} onChange={(hour, minute) => setAlarm((a) => ({ ...a, hour, minute }))} />

        <Text style={styles.sectionLabel}>Repeat</Text>
        <View style={styles.dayRow}>
          {DAY_LETTERS.map((letter, day) => {
            const on = alarm.repeatDays.includes(day);
            return (
              <Pressable key={day} onPress={() => toggleDay(day)} style={[styles.dayPill, on && styles.dayPillOn]}>
                <Text style={[styles.dayPillText, on && styles.dayPillTextOn]}>{letter}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Battle exercise</Text>
        <View style={styles.exerciseRow}>
          {EXERCISES.map(({ type, label }) => {
            const on = alarm.exerciseType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setAlarm((a) => ({ ...a, exerciseType: type }))}
                style={[styles.exercisePill, on && styles.exercisePillOn]}
              >
                <Text style={[styles.exercisePillText, on && styles.exercisePillTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Reps to win</Text>
        <View style={styles.stepperRow}>
          <Pressable style={styles.stepperButton} onPress={() => setAlarm((a) => ({ ...a, baseReps: Math.max(5, a.baseReps - 5) }))}>
            <Text style={styles.stepperButtonText}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{alarm.baseReps}</Text>
          <Pressable style={styles.stepperButton} onPress={() => setAlarm((a) => ({ ...a, baseReps: Math.min(100, a.baseReps + 5) }))}>
            <Text style={styles.stepperButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.sectionLabel}>Snooze (escalates the workout)</Text>
          <Switch
            value={alarm.snoozeEnabled}
            onValueChange={(v) => setAlarm((a) => ({ ...a, snoozeEnabled: v }))}
            trackColor={{ false: theme.color.border, true: theme.color.battle }}
            thumbColor={theme.color.textPrimary}
          />
        </View>

        <Text style={styles.sectionLabel}>Label</Text>
        <TextInput
          value={alarm.label}
          onChangeText={(label) => setAlarm((a) => ({ ...a, label }))}
          placeholder="Morning battle"
          placeholderTextColor={theme.color.textMuted}
          style={styles.input}
        />

        <Pressable style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Save Alarm' : 'Set Alarm'}</Text>
        </Pressable>

        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={remove}>
            <Text style={styles.deleteButtonText}>Delete Alarm</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  content: { padding: theme.space(5), gap: theme.space(3), paddingBottom: theme.space(16) },
  header: { color: theme.color.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: theme.space(2) },
  sectionLabel: { color: theme.color.textSecondary, fontSize: 13, marginTop: theme.space(4), fontWeight: '600' },
  dayRow: { flexDirection: 'row', gap: theme.space(2) },
  dayPill: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillOn: { backgroundColor: theme.color.battle, borderColor: theme.color.battle },
  dayPillText: { color: theme.color.textSecondary, fontWeight: '700' },
  dayPillTextOn: { color: theme.color.textPrimary },
  exerciseRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) },
  exercisePill: {
    paddingVertical: theme.space(2),
    paddingHorizontal: theme.space(4),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  exercisePillOn: { backgroundColor: theme.color.win, borderColor: theme.color.win },
  exercisePillText: { color: theme.color.textSecondary, fontWeight: '600' },
  exercisePillTextOn: { color: theme.color.background },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: theme.space(4) },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: { color: theme.color.textPrimary, fontSize: 22, fontWeight: '700' },
  stepperValue: { color: theme.color.textPrimary, fontSize: 24, fontWeight: '800', minWidth: 48, textAlign: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.color.border,
    color: theme.color.textPrimary,
    padding: theme.space(3),
  },
  saveButton: {
    marginTop: theme.space(8),
    backgroundColor: theme.color.battle,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.space(4),
    alignItems: 'center',
  },
  saveButtonText: { color: theme.color.textPrimary, fontSize: 16, fontWeight: '700' },
  deleteButton: { marginTop: theme.space(3), alignItems: 'center', padding: theme.space(3) },
  deleteButtonText: { color: theme.color.textMuted, fontWeight: '600' },
});
