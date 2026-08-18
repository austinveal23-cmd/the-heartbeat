package expo.modules.alarmscheduler

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

/** Fired by AlarmManager at the scheduled trigger time; hands off to the foreground service. */
class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val alarmId = intent.getStringExtra(EXTRA_ALARM_ID) ?: return
    val serviceIntent = Intent(context, AlarmRingingService::class.java).apply {
      action = AlarmRingingService.ACTION_START_RINGING
      putExtra(EXTRA_ALARM_ID, alarmId)
    }
    ContextCompat.startForegroundService(context, serviceIntent)
  }

  companion object {
    const val EXTRA_ALARM_ID = "alarmId"
  }
}
