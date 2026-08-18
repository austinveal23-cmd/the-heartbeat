/**
 * Mirrors modules/expo-alarm-scheduler/android/.../AlarmScheduling.kt's
 * computeNextTriggerMillis exactly (same semantics, same 0=Sun..6=Sat
 * convention) so Android's native scheduler and iOS's JS-side burst
 * scheduler agree on when "next Tuesday at 7:00" actually is.
 */
export function computeNextOccurrence(
  hour: number,
  minute: number,
  repeatDays: number[],
  now: Date = new Date()
): Date {
  const candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);

  if (repeatDays.length === 0) {
    if (candidate.getTime() <= now.getTime()) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return candidate;
  }

  const targetDays = new Set(repeatDays);
  for (let offset = 0; offset <= 7; offset++) {
    const c = new Date(candidate);
    c.setDate(c.getDate() + offset);
    const isToday = offset === 0;
    if (targetDays.has(c.getDay()) && (!isToday || c.getTime() > now.getTime())) {
      return c;
    }
  }
  // Unreachable: the 0..7 sweep always covers a full week.
  return candidate;
}
