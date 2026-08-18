export const POINTS = {
  COMPLETION_BASE: 10,
  PLACEMENT_BONUS: { 1: 15, 2: 10, 3: 5 } as Record<number, number>,
  STREAK_BONUS_PER_DAY: 1,
  STREAK_BONUS_CAP: 20,
} as const;

/** Snoozing escalates the workout instead of just delaying it. */
export function snoozeMultiplier(snoozeCount: number): number {
  if (snoozeCount <= 0) return 1;
  if (snoozeCount === 1) return 1.25;
  if (snoozeCount === 2) return 1.5;
  return 2;
}

export function requiredReps(baseReps: number, snoozeCount: number): number {
  return Math.ceil(baseReps * snoozeMultiplier(snoozeCount));
}

export function placementBonus(rank: number | null): number {
  if (rank === null) return 0;
  return POINTS.PLACEMENT_BONUS[rank] ?? 0;
}

export function streakBonus(currentStreak: number): number {
  return Math.min(currentStreak * POINTS.STREAK_BONUS_PER_DAY, POINTS.STREAK_BONUS_CAP);
}

export function pointsForCompletion(args: { rank: number | null; currentStreak: number }): number {
  return POINTS.COMPLETION_BASE + placementBonus(args.rank) + streakBonus(args.currentStreak);
}

/** Ranks participants by completion time; DNFs (null time) sort last and share no rank. */
export function rankByCompletionTime<T extends { userId: string; completionTimeMs: number | null }>(
  participants: T[]
): Map<string, number | null> {
  const ranked = participants
    .filter((p) => p.completionTimeMs !== null)
    .sort((a, b) => (a.completionTimeMs as number) - (b.completionTimeMs as number));

  const ranks = new Map<string, number | null>();
  ranked.forEach((p, i) => ranks.set(p.userId, i + 1));
  participants.forEach((p) => {
    if (!ranks.has(p.userId)) ranks.set(p.userId, null);
  });
  return ranks;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** A streak continues on a completion the same day or the very next local day; otherwise it resets to 1. */
export function nextStreak(args: {
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
  completedDate: string; // 'YYYY-MM-DD'
  currentStreak: number;
}): number {
  const { lastCompletedDate, completedDate, currentStreak } = args;
  if (!lastCompletedDate) return 1;
  if (lastCompletedDate === completedDate) return currentStreak;

  const last = new Date(`${lastCompletedDate}T00:00:00Z`).getTime();
  const completed = new Date(`${completedDate}T00:00:00Z`).getTime();
  const dayGap = Math.round((completed - last) / ONE_DAY_MS);

  return dayGap === 1 ? currentStreak + 1 : 1;
}
