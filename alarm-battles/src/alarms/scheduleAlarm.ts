import { Platform } from 'react-native';
import * as AndroidAlarmScheduler from 'expo-alarm-scheduler';
import { cancelIOSAlarm, scheduleIOSAlarm, stopIOSAlarm, type IOSAlarmDescriptor } from './iosAlarmFallback';

export type AlarmDescriptor = IOSAlarmDescriptor;

/**
 * True if the OS-level scheduler backing this platform actually ran last
 * time it was tried. Starts true (optimistic) so the UI doesn't show a
 * warning before it's had a chance to fail; screens that care (Home,
 * AlarmCreate) should treat `false` as "alarms are saved locally but won't
 * actually ring — rebuild with a dev client that links expo-alarm-scheduler."
 */
let lastNativeCallSucceeded = true;
export function nativeSchedulingIsWorking(): boolean {
  return lastNativeCallSucceeded;
}

/**
 * A missing/unlinked native module (Expo Go, or a dev-client build where
 * expo-alarm-scheduler didn't link) must not block saving an alarm locally —
 * upsertAlarm's caller (src/store/alarmStore.ts) awaits this, and previously
 * a thrown error here meant the alarm never even made it into local state,
 * so the Home screen stayed empty with no visible cause. Log loudly, but
 * don't propagate.
 */
async function runNativeCall(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    lastNativeCallSucceeded = true;
  } catch (error) {
    lastNativeCallSucceeded = false;
    console.warn('[alarms] native scheduling call failed — alarm is saved locally but will not actually ring:', error);
  }
}

/** Platform-neutral entry point the UI calls — Home/AlarmCreate/AlarmRinging
 *  screens should never import the Android or iOS scheduler directly. */
export async function armAlarm(alarm: AlarmDescriptor): Promise<void> {
  await runNativeCall(() =>
    Platform.OS === 'android' ? AndroidAlarmScheduler.scheduleAlarm(alarm) : scheduleIOSAlarm(alarm).then(() => undefined)
  );
}

export async function disarmAlarm(alarm: AlarmDescriptor): Promise<void> {
  await runNativeCall(() => (Platform.OS === 'android' ? AndroidAlarmScheduler.cancelAlarm(alarm.id) : cancelIOSAlarm(alarm.id)));
}

/** Called once the camera-verified workout completes. */
export async function silenceRingingAlarm(alarm: AlarmDescriptor): Promise<void> {
  await runNativeCall(() => (Platform.OS === 'android' ? AndroidAlarmScheduler.stopRinging(alarm.id) : stopIOSAlarm(alarm)));
}
