import { Platform } from 'react-native';
import { requireNativeModule, requireOptionalNativeModule } from 'expo-modules-core';

export interface AlarmDescriptor {
  id: string;
  hour: number;
  minute: number;
  /** 0 (Sun) .. 6 (Sat). Empty = fires once. */
  repeatDays: number[];
  label: string;
}

interface NativeAlarmSchedulerModule {
  scheduleAlarm(id: string, hour: number, minute: number, repeatDays: number[], label: string): Promise<void>;
  cancelAlarm(id: string): Promise<void>;
  stopRinging(id: string): Promise<void>;
  canScheduleExactAlarms(): Promise<boolean>;
}

/**
 * True only on Android with the native module actually linked. Callers
 * (src/store/alarmStore.ts, src/screens/AlarmRingingScreen.tsx) use this to
 * decide whether to bother calling the scheduler at all, rather than relying
 * on catching a thrown error every time.
 */
export function isAlarmSchedulerAvailable(): boolean {
  return Platform.OS === 'android' && requireOptionalNativeModule('ExpoAlarmScheduler') !== null;
}

function getNativeModule(): NativeAlarmSchedulerModule {
  if (Platform.OS !== 'android') {
    throw new Error(
      'expo-alarm-scheduler is Android-only (AlarmManager.setAlarmClock + full-screen intent). ' +
        'iOS uses the burst-scheduled expo-notifications fallback in src/alarms/iosAlarmFallback.ts.'
    );
  }
  return requireNativeModule<NativeAlarmSchedulerModule>('ExpoAlarmScheduler');
}

export async function scheduleAlarm(alarm: AlarmDescriptor): Promise<void> {
  await getNativeModule().scheduleAlarm(alarm.id, alarm.hour, alarm.minute, alarm.repeatDays, alarm.label);
}

export async function cancelAlarm(id: string): Promise<void> {
  await getNativeModule().cancelAlarm(id);
}

/** Silences the ringing alarm and (for repeating alarms) arms the next occurrence. */
export async function stopRinging(id: string): Promise<void> {
  await getNativeModule().stopRinging(id);
}

/** Android 12+ requires this permission to be granted for exact alarms to fire on time. */
export async function canScheduleExactAlarms(): Promise<boolean> {
  return getNativeModule().canScheduleExactAlarms();
}
