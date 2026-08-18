package expo.modules.alarmscheduler

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import java.util.Calendar

object AlarmScheduling {
  /**
   * AlarmManager.setAlarmClock (rather than setExactAndAllowWhileIdle) is
   * the API meant for user-facing alarm-clock apps: it's exempt from Doze
   * throttling and shows the alarm-clock icon in the status bar.
   */
  fun scheduleNext(context: Context, alarm: StoredAlarm) {
    val triggerAtMillis = computeNextTriggerMillis(alarm.hour, alarm.minute, alarm.repeatDays)
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val clockInfo = AlarmManager.AlarmClockInfo(triggerAtMillis, showIntent(context, alarm.id))
    alarmManager.setAlarmClock(clockInfo, operationIntent(context, alarm.id))
  }

  fun cancel(context: Context, alarmId: String) {
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    alarmManager.cancel(operationIntent(context, alarmId))
  }

  fun requestCode(alarmId: String): Int = alarmId.hashCode()

  /** The deep link the ringing UI (full-screen notification / activity launch) targets. */
  fun ringingDeepLink(alarmId: String): Uri =
    Uri.parse("alarmbattles://alarm-ringing?alarmId=$alarmId")

  fun computeNextTriggerMillis(
    hour: Int,
    minute: Int,
    repeatDays: List<Int>,
    now: Calendar = Calendar.getInstance()
  ): Long {
    val candidate = now.clone() as Calendar
    candidate.set(Calendar.HOUR_OF_DAY, hour)
    candidate.set(Calendar.MINUTE, minute)
    candidate.set(Calendar.SECOND, 0)
    candidate.set(Calendar.MILLISECOND, 0)

    if (repeatDays.isEmpty()) {
      if (candidate.timeInMillis <= now.timeInMillis) {
        candidate.add(Calendar.DAY_OF_YEAR, 1)
      }
      return candidate.timeInMillis
    }

    // Calendar.DAY_OF_WEEK: Sunday = 1 .. Saturday = 7. Our schema is 0 = Sun .. 6 = Sat.
    val targetDows = repeatDays.map { it + 1 }.toSet()
    for (offset in 0..7) {
      val c = candidate.clone() as Calendar
      c.add(Calendar.DAY_OF_YEAR, offset)
      val isToday = offset == 0
      if (targetDows.contains(c.get(Calendar.DAY_OF_WEEK)) && (!isToday || c.timeInMillis > now.timeInMillis)) {
        return c.timeInMillis
      }
    }
    // Unreachable: the 0..7 sweep always covers a full week, so some day matches above.
    return candidate.timeInMillis
  }

  private fun operationIntent(context: Context, alarmId: String): PendingIntent {
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      putExtra(AlarmReceiver.EXTRA_ALARM_ID, alarmId)
    }
    return PendingIntent.getBroadcast(
      context,
      requestCode(alarmId),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }

  private fun showIntent(context: Context, alarmId: String): PendingIntent {
    val intent = Intent(Intent.ACTION_VIEW, ringingDeepLink(alarmId)).apply {
      setPackage(context.packageName)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    }
    return PendingIntent.getActivity(
      context,
      requestCode(alarmId),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }
}
