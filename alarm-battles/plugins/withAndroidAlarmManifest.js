const { withAndroidManifest } = require('@expo/config-plugins');

const RECEIVER_NAME = 'expo.modules.alarmscheduler.AlarmReceiver';
const SERVICE_NAME = 'expo.modules.alarmscheduler.AlarmRingingService';
const BOOT_RECEIVER_NAME = 'expo.modules.alarmscheduler.BootRestoreReceiver';

/**
 * expo-alarm-scheduler (modules/expo-alarm-scheduler) needs a manifest
 * receiver/service pair that isn't expressible through app.json alone.
 * Regular Expo Modules autolinking handles Gradle/Podspec wiring, but
 * manifest components still need an explicit config plugin.
 */
function withAndroidAlarmManifest(config) {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (!app) return config;

    app.receiver = app.receiver ?? [];
    app.service = app.service ?? [];

    if (!app.receiver.some((r) => r.$['android:name'] === RECEIVER_NAME)) {
      app.receiver.push({
        $: { 'android:name': RECEIVER_NAME, 'android:exported': 'false' },
      });
    }

    if (!app.receiver.some((r) => r.$['android:name'] === BOOT_RECEIVER_NAME)) {
      app.receiver.push({
        $: { 'android:name': BOOT_RECEIVER_NAME, 'android:exported': 'true' },
        'intent-filter': [
          {
            action: [{ $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } }],
          },
        ],
      });
    }

    if (!app.service.some((s) => s.$['android:name'] === SERVICE_NAME)) {
      app.service.push({
        $: {
          'android:name': SERVICE_NAME,
          'android:exported': 'false',
          'android:foregroundServiceType': 'mediaPlayback',
        },
      });
    }

    return config;
  });
}

module.exports = withAndroidAlarmManifest;
