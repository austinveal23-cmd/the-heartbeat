export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Home: undefined;
  AlarmCreate: { alarmId?: string } | undefined;
  AlarmRinging: { alarmId: string };
  WorkoutCamera: { alarmId: string; requiredReps: number };
  WorkoutComplete: { alarmId: string; repsCompleted: number };
};
