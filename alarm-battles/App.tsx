import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import { configureNotificationHandler } from './src/notifications/setup';

configureNotificationHandler();

export default function App() {
  useEffect(() => {
    // Android's ringing UI arrives via the alarmbattles:// deep link
    // (expo-alarm-scheduler's full-screen intent). iOS's burst-scheduled
    // notifications (src/alarms/iosAlarmFallback.ts) don't open a URL when
    // tapped, so route them manually from their `data.alarmId`.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const alarmId = response.notification.request.content.data?.alarmId;
      if (typeof alarmId === 'string' && navigationRef.isReady()) {
        navigationRef.navigate('AlarmRinging', { alarmId });
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
