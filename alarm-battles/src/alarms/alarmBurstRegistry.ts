import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'iosAlarmBurstRegistry';

/**
 * Persists which scheduled-notification IDs belong to which alarm's burst,
 * so a later app session (e.g. the user force-quit and relaunched from the
 * lock screen) can still find and cancel the remaining ones once the
 * workout is verified complete.
 */
async function readRegistry(): Promise<Record<string, string[]>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function writeRegistry(registry: Record<string, string[]>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

export async function saveBurstNotificationIds(alarmId: string, notificationIds: string[]): Promise<void> {
  const registry = await readRegistry();
  registry[alarmId] = notificationIds;
  await writeRegistry(registry);
}

export async function takeBurstNotificationIds(alarmId: string): Promise<string[]> {
  const registry = await readRegistry();
  const ids = registry[alarmId] ?? [];
  delete registry[alarmId];
  await writeRegistry(registry);
  return ids;
}
