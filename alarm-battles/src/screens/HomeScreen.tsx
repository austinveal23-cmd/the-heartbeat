import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlarmStore, type Alarm } from '../store/alarmStore';
import { nativeSchedulingIsWorking } from '../alarms/scheduleAlarm';
import { theme, numeralStyle } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatTime(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

function repeatSummary(repeatDays: number[]): string {
  if (repeatDays.length === 0) return 'Once';
  if (repeatDays.length === 7) return 'Every day';
  return [...repeatDays]
    .sort()
    .map((d) => DAY_LETTERS[d])
    .join(' ');
}

function AlarmCard({
  alarm,
  onPress,
  onToggle,
  onTestRing,
}: {
  alarm: Alarm;
  onPress: () => void;
  onToggle: (v: boolean) => void;
  onTestRing: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={[styles.time, numeralStyle, !alarm.active && styles.dimmed]}>
          {formatTime(alarm.hour, alarm.minute)}
        </Text>
        <Text style={[styles.meta, !alarm.active && styles.dimmed]}>
          {repeatSummary(alarm.repeatDays)} · {alarm.exerciseType.replace('_', ' ')} · {alarm.baseReps} reps
        </Text>
        {alarm.label ? <Text style={[styles.label, !alarm.active && styles.dimmed]}>{alarm.label}</Text> : null}
      </View>
      <View style={styles.cardRight}>
        <Switch
          value={alarm.active}
          onValueChange={onToggle}
          trackColor={{ false: theme.color.border, true: theme.color.battle }}
          thumbColor={theme.color.textPrimary}
        />
        <Pressable onPress={onTestRing} hitSlop={8} style={styles.testRingButton}>
          <Text style={styles.testRingButtonText}>Test Ring ▸</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export function HomeScreen({ navigation }: Props) {
  const alarms = useAlarmStore((s) => s.alarms);
  const setActive = useAlarmStore((s) => s.setActive);
  const [schedulerWorking, setSchedulerWorking] = useState(true);

  // Re-check on focus (e.g. right after saving an alarm on AlarmCreate) —
  // nativeSchedulingIsWorking() isn't itself reactive, it just reflects
  // whether the last native scheduling call succeeded.
  useFocusEffect(
    useCallback(() => {
      setSchedulerWorking(nativeSchedulingIsWorking());
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>ALARM BATTLES</Text>
        <Text style={styles.subtitle}>Get up. Move. Win.</Text>
      </View>

      {!schedulerWorking && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningBannerText}>
            Alarms are saved but won't actually ring — native scheduling isn't linked in this build. Use
            "Test Ring" to preview the flow, or build a full dev client (see RUNNING.md).
          </Text>
        </View>
      )}

      <FlatList
        data={alarms}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No alarms yet. Set one to start your streak.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            onPress={() => navigation.navigate('AlarmCreate', { alarmId: item.id })}
            onToggle={(v) => setActive(item.id, v)}
            onTestRing={() => navigation.navigate('AlarmRinging', { alarmId: item.id })}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AlarmCreate')}>
        <Text style={styles.fabText}>+ New Alarm</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  header: { paddingHorizontal: theme.space(6), paddingTop: theme.space(4), paddingBottom: theme.space(2) },
  title: { color: theme.color.textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: 1 },
  subtitle: { color: theme.color.textSecondary, marginTop: theme.space(1), fontSize: 14 },
  listContent: { paddingHorizontal: theme.space(4), paddingBottom: theme.space(24), gap: theme.space(3) },
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: { flex: 1, marginRight: theme.space(3) },
  cardRight: { alignItems: 'flex-end', gap: theme.space(2) },
  testRingButton: { paddingVertical: theme.space(1), paddingHorizontal: theme.space(1) },
  testRingButtonText: { color: theme.color.win, fontSize: 12, fontWeight: '700' },
  warningBanner: {
    marginHorizontal: theme.space(6),
    marginBottom: theme.space(2),
    padding: theme.space(3),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.battleDim,
    borderWidth: 1,
    borderColor: theme.color.battle,
  },
  warningBannerText: { color: theme.color.textPrimary, fontSize: 12, lineHeight: 17 },
  time: { color: theme.color.textPrimary, fontSize: 32 },
  meta: { color: theme.color.textSecondary, fontSize: 13, marginTop: theme.space(1), textTransform: 'capitalize' },
  label: { color: theme.color.textMuted, fontSize: 12, marginTop: theme.space(1) },
  dimmed: { opacity: 0.4 },
  empty: { paddingTop: theme.space(20), alignItems: 'center' },
  emptyText: { color: theme.color.textSecondary, fontSize: 14, textAlign: 'center', paddingHorizontal: theme.space(8) },
  fab: {
    position: 'absolute',
    bottom: theme.space(6),
    alignSelf: 'center',
    backgroundColor: theme.color.battle,
    paddingVertical: theme.space(4),
    paddingHorizontal: theme.space(8),
    borderRadius: theme.radius.pill,
    shadowColor: theme.color.battle,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: theme.color.textPrimary, fontWeight: '700', fontSize: 16 },
});
