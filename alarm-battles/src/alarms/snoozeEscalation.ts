/**
 * Client-side copy of functions/src/scoring.ts's snoozeMultiplier/requiredReps.
 * The app needs this to know "how many reps right now" during the live
 * ringing/workout flow; functions/src/scoring.ts remains the authoritative
 * copy for points awarded server-side. Keep the two in sync by hand — they're
 * small and in separate deployable packages (app vs. Cloud Functions), so a
 * shared import isn't worth the build-graph complexity here.
 */
export function snoozeMultiplier(snoozeCount: number): number {
  if (snoozeCount <= 0) return 1;
  if (snoozeCount === 1) return 1.25;
  if (snoozeCount === 2) return 1.5;
  return 2;
}

export function requiredReps(baseReps: number, snoozeCount: number): number {
  return Math.ceil(baseReps * snoozeMultiplier(snoozeCount));
}
