import type { FieldValue, Timestamp } from '@react-native-firebase/firestore';
import type { ExerciseType } from '../types/exercise';

/**
 * Firestore layout:
 *   users/{userId}
 *   users/{userId}/alarms/{alarmId}
 *   users/{userId}/friends/{friendId}        (mirrored on both sides)
 *   battles/{battleId}
 *   workoutClips/{clipId}
 *
 * Points, streak, and battle-ranking math is computed server-side in
 * functions/src/scoring.ts — clients never write points/streak fields
 * directly (see firestore.rules).
 */

export interface UserDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // 'YYYY-MM-DD' in the user's local tz
  friendIds: string[];
  createdAt: Timestamp | FieldValue;
}

export interface AlarmDoc {
  id: string;
  label: string;
  hour: number; // 0-23, local time
  minute: number; // 0-59
  repeatDays: number[]; // 0 (Sun) - 6 (Sat); empty = one-off
  soundId: string;
  snoozeEnabled: boolean;
  /** Each snooze escalates the required workout: 1st +25%, 2nd +50%, 3rd+ double. */
  snoozeCount: number;
  exerciseType: ExerciseType;
  baseReps: number;
  active: boolean;
  createdAt: Timestamp | FieldValue;
}

export type BattleType = 'solo' | '1v1' | 'group';
export type BattleStatus = 'pending' | 'active' | 'completed';

export interface BattleParticipantResult {
  userId: string;
  completedAt: Timestamp | FieldValue | null;
  completionTimeMs: number | null;
  repsCompleted: number;
  pointsAwarded: number;
  rank: number | null;
}

export interface BattleDoc {
  id: string;
  type: BattleType;
  exerciseType: ExerciseType;
  participantIds: string[];
  results: Record<string, BattleParticipantResult>;
  status: BattleStatus;
  createdAt: Timestamp | FieldValue;
  windowStartsAt: Timestamp;
  windowEndsAt: Timestamp;
}

export type FriendStatus = 'pending' | 'accepted';

export interface FriendDoc {
  friendId: string;
  status: FriendStatus;
  requestedBy: string;
  since: Timestamp | FieldValue;
}

export interface WorkoutClipDoc {
  id: string;
  userId: string;
  battleId: string | null;
  storagePath: string;
  durationMs: number;
  exerciseType: ExerciseType;
  repsCompleted: number;
  createdAt: Timestamp | FieldValue;
}
