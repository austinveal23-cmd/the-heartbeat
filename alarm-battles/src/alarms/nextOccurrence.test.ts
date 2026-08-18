import { computeNextOccurrence } from './nextOccurrence';

// Deliberately not hardcoding which weekday this date falls on — the tests
// derive their expectations from `now.getDay()` itself so they don't depend
// on memorized calendar facts.
const now = new Date(2026, 7, 17, 8, 0, 0);
const nowDow = now.getDay();

describe('computeNextOccurrence', () => {
  it('returns later today for a one-off alarm not yet passed', () => {
    const result = computeNextOccurrence(9, 0, [], now);
    expect(result.getDate()).toBe(now.getDate());
    expect(result.getHours()).toBe(9);
  });

  it('rolls a one-off alarm to tomorrow if its time already passed today', () => {
    const result = computeNextOccurrence(7, 0, [], now);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(result.getDate()).toBe(tomorrow.getDate());
    expect(result.getHours()).toBe(7);
  });

  it('fires a repeating alarm today if its time has not passed yet', () => {
    const result = computeNextOccurrence(9, 0, [nowDow], now);
    expect(result.getDate()).toBe(now.getDate());
    expect(result.getDay()).toBe(nowDow);
  });

  it('skips today for a repeating alarm whose time already passed, picks the next matching day', () => {
    const nextDow = (nowDow + 2) % 7;
    const result = computeNextOccurrence(7, 0, [nowDow, nextDow], now);
    expect(result.getDay()).toBe(nextDow);
    expect(result.getTime()).toBeGreaterThan(now.getTime());
  });

  it('wraps to next week when the only matching day is earlier in the week than today', () => {
    const earlierDow = (nowDow + 6) % 7; // yesterday's weekday
    const result = computeNextOccurrence(9, 0, [earlierDow], now);
    expect(result.getDay()).toBe(earlierDow);
    expect(result.getTime()).toBeGreaterThan(now.getTime());
    // Should be roughly a week out (within a day of 7 days), not today or tomorrow.
    const daysOut = (result.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    expect(daysOut).toBeGreaterThan(5);
  });
});
