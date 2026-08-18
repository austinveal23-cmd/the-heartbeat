import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { nextStreak, pointsForCompletion, rankByCompletionTime } from './scoring';

initializeApp();
const db = getFirestore();

interface ParticipantResult {
  userId: string;
  completedAt: FirebaseFirestore.Timestamp | null;
  completionTimeMs: number | null;
  repsCompleted: number;
  pointsAwarded: number;
  rank: number | null;
}

interface BattleDoc {
  participantIds: string[];
  results: Record<string, ParticipantResult>;
  status: 'pending' | 'active' | 'completed';
  windowEndsAt: FirebaseFirestore.Timestamp;
}

/**
 * Fires whenever a client marks their own result as complete
 * (results.{uid}.completedAt set). Recomputes ranks/points once every
 * participant has finished, or once the window has expired.
 */
export const finalizeBattleOnResult = onDocumentUpdated('battles/{battleId}', async (event) => {
  const before = event.data?.before.data() as BattleDoc | undefined;
  const after = event.data?.after.data() as BattleDoc | undefined;
  if (!after || after.status === 'completed') return;

  const allIn = after.participantIds.every((uid) => after.results[uid]?.completedAt != null);
  const windowExpired = after.windowEndsAt.toMillis() <= Date.now();
  if (!allIn && !windowExpired) return;
  if (before && JSON.stringify(before.results) === JSON.stringify(after.results) && !windowExpired) {
    return; // no new result landed and window hasn't expired; avoid duplicate work
  }

  await finalizeBattle(event.params.battleId, after);
});

/** Safety net for battles nobody finished — closes out anything past its window. */
export const closeExpiredBattles = onSchedule('every 15 minutes', async () => {
  const now = FieldValue.serverTimestamp();
  const expired = await db
    .collection('battles')
    .where('status', 'in', ['pending', 'active'])
    .where('windowEndsAt', '<=', now)
    .get();

  await Promise.all(
    expired.docs.map((snap) => finalizeBattle(snap.id, snap.data() as BattleDoc))
  );
});

async function finalizeBattle(battleId: string, battle: BattleDoc): Promise<void> {
  const participants = battle.participantIds.map((userId) => ({
    userId,
    completionTimeMs: battle.results[userId]?.completionTimeMs ?? null,
  }));
  const ranks = rankByCompletionTime(participants);

  await db.runTransaction(async (tx) => {
    const battleRef = db.collection('battles').doc(battleId);
    const userRefs = battle.participantIds.map((uid) => db.collection('users').doc(uid));
    const userSnaps = await Promise.all(userRefs.map((ref) => tx.get(ref)));

    const updatedResults: Record<string, ParticipantResult> = {};

    userSnaps.forEach((userSnap, i) => {
      const userId = battle.participantIds[i];
      const existing = battle.results[userId];
      const rank = ranks.get(userId) ?? null;
      const completed = existing?.completedAt != null;

      const user = userSnap.data() ?? {
        points: 0,
        currentStreak: 0,
        lastCompletedDate: null,
      };

      let currentStreak = user.currentStreak ?? 0;
      let lastCompletedDate = user.lastCompletedDate ?? null;
      let pointsAwarded = 0;

      if (completed) {
        const completedDate = existing.completedAt!.toDate().toISOString().slice(0, 10);
        currentStreak = nextStreak({
          lastCompletedDate,
          completedDate,
          currentStreak,
        });
        lastCompletedDate = completedDate;
        pointsAwarded = pointsForCompletion({ rank, currentStreak });

        tx.update(userRefs[i], {
          points: FieldValue.increment(pointsAwarded),
          currentStreak,
          longestStreak: Math.max(currentStreak, user.longestStreak ?? 0),
          lastCompletedDate,
        });
      }

      updatedResults[userId] = {
        userId,
        completedAt: existing?.completedAt ?? null,
        completionTimeMs: existing?.completionTimeMs ?? null,
        repsCompleted: existing?.repsCompleted ?? 0,
        pointsAwarded,
        rank,
      };
    });

    tx.update(battleRef, { results: updatedResults, status: 'completed' });
  });

  logger.info(`Finalized battle ${battleId}`);
}
