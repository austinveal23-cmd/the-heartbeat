import * as Notifications from 'expo-notifications';
import { computeNextOccurrence } from './nextOccurrence';
import { saveBurstNotificationIds, takeBurstNotificationIds } from './alarmBurstRegistry';

/**
 * iOS forbids `repeats: true` on a TIME_INTERVAL trigger under 60 seconds
 * (confirmed against the installed expo-notifications' Notifications.types.d.ts),
 * so a "ring every 5-10s until dismissed" alarm isn't a single scheduled
 * notification here — it's a burst of individually DATE-triggered ones.
 * `interruptionLevel: 'critical'` is set on each; it's a no-op without the
 * com.apple.developer.usernotifications.critical-alerts entitlement (Apple
 * approval required, not guaranteed — see app.json), and silently degrades
 * to a normal notification without it. Don't block on that approval.
 */
const BURST_INTERVAL_SECONDS = 7;
const BURST_DURATION_MINUTES = 5;

export interface IOSAlarmDescriptor {
  id: string;
  hour: number;
  minute: number;
  repeatDays: number[];
  label: string;
}

export async function requestCriticalAlertsPermission(): Promise<Notifications.NotificationPermissionsStatus> {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowCriticalAlerts: true,
    },
  });
}

export async function scheduleIOSAlarm(alarm: IOSAlarmDescriptor): Promise<Date> {
  const fireDate = computeNextOccurrence(alarm.hour, alarm.minute, alarm.repeatDays);
  const burstCount = Math.ceil((BURST_DURATION_MINUTES * 60) / BURST_INTERVAL_SECONDS);

  const notificationIds = await Promise.all(
    Array.from({ length: burstCount }, (_, i) => {
      const date = new Date(fireDate.getTime() + i * BURST_INTERVAL_SECONDS * 1000);
      return Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alarm Battles',
          body: alarm.label || "Get up and move — it won't stop until you do.",
          sound: 'default', // TODO: swap for a bundled loud alarm sound (see app.json expo-notifications plugin)
          interruptionLevel: 'critical',
          data: { alarmId: alarm.id, kind: 'alarm-burst' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
        },
      });
    })
  );

  await saveBurstNotificationIds(alarm.id, notificationIds);
  return fireDate;
}

export async function cancelIOSAlarm(alarmId: string): Promise<void> {
  const ids = await takeBurstNotificationIds(alarmId);
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

/**
 * Called once the workout is verified complete. Cancels whatever's left of
 * the current burst, then re-arms the next occurrence for repeating alarms
 * (one-offs are just left cancelled) — mirrors expo-alarm-scheduler's
 * stopRinging behavior on Android.
 */
export async function stopIOSAlarm(alarm: IOSAlarmDescriptor): Promise<void> {
  await cancelIOSAlarm(alarm.id);
  if (alarm.repeatDays.length > 0) {
    await scheduleIOSAlarm(alarm);
  }
}
