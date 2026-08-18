package expo.modules.alarmscheduler

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** AlarmManager entries are wiped on reboot; this re-arms everything from AlarmStore. */
class BootRestoreReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
    AlarmStore.getAll(context).forEach { alarm ->
      AlarmScheduling.scheduleNext(context, alarm)
    }
  }
}
