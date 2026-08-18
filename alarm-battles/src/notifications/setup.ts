import * as Notifications from 'expo-notifications';

/**
 * Without this, iOS/Android suppress local notifications while the app is
 * foregrounded — which would defeat the point of the alarm-burst fallback
 * (src/alarms/iosAlarmFallback.ts) if the app happens to be open when the
 * alarm fires.
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
