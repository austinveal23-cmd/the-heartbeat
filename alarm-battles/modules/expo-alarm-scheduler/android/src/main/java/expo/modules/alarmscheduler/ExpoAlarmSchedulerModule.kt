package expo.modules.alarmscheduler

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.os.Build
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoAlarmSchedulerModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("ExpoAlarmScheduler")

    AsyncFunction("scheduleAlarm") { id: String, hour: Int, minute: Int, repeatDays: List<Int>, label: String ->
      val alarm = StoredAlarm(id, hour, minute, repeatDays, label)
      AlarmStore.put(context, alarm)
      AlarmScheduling.scheduleNext(context, alarm)
    }

    AsyncFunction("cancelAlarm") { id: String ->
      AlarmStore.remove(context, id)
      AlarmScheduling.cancel(context, id)
    }

    // Stops the ringing sound/notification for `id`. Repeating alarms roll
    // forward to their next occurrence; one-offs are removed entirely.
    AsyncFunction("stopRinging") { id: String ->
      context.startService(
        Intent(context, AlarmRingingService::class.java).apply {
          action = AlarmRingingService.ACTION_STOP_RINGING
        }
      )

      val alarm = AlarmStore.getAll(context).find { it.id == id }
      if (alarm != null) {
        if (alarm.repeatDays.isEmpty()) {
          AlarmStore.remove(context, id)
        } else {
          AlarmScheduling.scheduleNext(context, alarm)
        }
      }
    }

    AsyncFunction("canScheduleExactAlarms") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.canScheduleExactAlarms()
      } else {
        true
      }
    }
  }
}
