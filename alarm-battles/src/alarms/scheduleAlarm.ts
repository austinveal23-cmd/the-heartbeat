import { Platform } from 'react-native';
import * as AndroidAlarmScheduler from 'expo-alarm-scheduler';
import { cancelIOSAlarm, scheduleIOSAlarm, stopIOSAlarm, type IOSAlarmDescriptor } from './iosAlarmFallback';

export type AlarmDescriptor = IOSAlarmDescriptor;

/** Platform-neutral entry point the UI calls — Home/AlarmCreate/AlarmRinging
 *  screens should never import the Android or iOS scheduler directly. */
export async function armAlarm(alarm: AlarmDescriptor): Promise<void> {
  if (Platform.OS === 'android') {
    await AndroidAlarmScheduler.scheduleAlarm(alarm);
  } else {
    await scheduleIOSAlarm(alarm);
  }
}

export async function disarmAlarm(alarm: AlarmDescriptor): Promise<void> {
  if (Platform.OS === 'android') {
    await AndroidAlarmScheduler.cancelAlarm(alarm.id);
  } else {
    await cancelIOSAlarm(alarm.id);
  }
}

/** Called once the camera-verified workout completes. */
export async function silenceRingingAlarm(alarm: AlarmDescriptor): Promise<void> {
  if (Platform.OS === 'android') {
    await AndroidAlarmScheduler.stopRinging(alarm.id);
  } else {
    await stopIOSAlarm(alarm);
  }
}
