import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ExerciseType } from '../types/exercise';
import { armAlarm, disarmAlarm, type AlarmDescriptor } from '../alarms/scheduleAlarm';

/**
 * Local-first alarm state, persisted on-device via AsyncStorage. Firebase
 * Auth/Firestore are scaffolded (src/firebase) but not wired into this store
 * yet — that's account creation (MVP item 1), which comes after this spike.
 */
export interface Alarm extends AlarmDescriptor {
  exerciseType: ExerciseType;
  baseReps: number;
  snoozeEnabled: boolean;
  active: boolean;
}

interface AlarmStoreState {
  alarms: Alarm[];
  upsertAlarm: (alarm: Alarm) => Promise<void>;
  removeAlarm: (id: string) => Promise<void>;
  setActive: (id: string, active: boolean) => Promise<void>;
  getAlarm: (id: string) => Alarm | undefined;
}

export const useAlarmStore = create<AlarmStoreState>()(
  persist(
    (set, get) => ({
      alarms: [],

      upsertAlarm: async (alarm) => {
        if (alarm.active) {
          await armAlarm(alarm);
        } else {
          await disarmAlarm(alarm);
        }
        set((state) => ({
          alarms: [...state.alarms.filter((a) => a.id !== alarm.id), alarm].sort(
            (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
          ),
        }));
      },

      removeAlarm: async (id) => {
        const alarm = get().alarms.find((a) => a.id === id);
        if (alarm) await disarmAlarm(alarm);
        set((state) => ({ alarms: state.alarms.filter((a) => a.id !== id) }));
      },

      setActive: async (id, active) => {
        const alarm = get().alarms.find((a) => a.id === id);
        if (!alarm) return;
        await get().upsertAlarm({ ...alarm, active });
      },

      getAlarm: (id) => get().alarms.find((a) => a.id === id),
    }),
    {
      name: 'alarm-battles-alarms',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
