export type RootStackParamList = {
  Home: undefined;
  AlarmCreate: { alarmId?: string } | undefined;
  AlarmRinging: { alarmId: string };
  WorkoutCamera: { alarmId: string; requiredReps: number };
  WorkoutComplete: { alarmId: string; repsCompleted: number };
};
