package expo.modules.alarmscheduler

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * Descriptor persisted in plain SharedPreferences (not JS-side storage) so
 * BootRestoreReceiver can re-arm every alarm after a reboot without needing
 * React Native / JS to have started yet.
 */
data class StoredAlarm(
  val id: String,
  val hour: Int,
  val minute: Int,
  /** 0 (Sun) .. 6 (Sat), matching src/firebase/schema.ts AlarmDoc.repeatDays. Empty = one-off. */
  val repeatDays: List<Int>,
  val label: String
)

object AlarmStore {
  private const val PREFS_NAME = "expo_alarm_scheduler"
  private const val KEY_ALARMS = "alarms"

  fun getAll(context: Context): List<StoredAlarm> {
    val raw = prefs(context).getString(KEY_ALARMS, null) ?: return emptyList()
    val array = JSONArray(raw)
    return (0 until array.length()).map { i ->
      val obj = array.getJSONObject(i)
      val days = obj.getJSONArray("repeatDays")
      StoredAlarm(
        id = obj.getString("id"),
        hour = obj.getInt("hour"),
        minute = obj.getInt("minute"),
        repeatDays = (0 until days.length()).map { days.getInt(it) },
        label = obj.optString("label", "")
      )
    }
  }

  fun put(context: Context, alarm: StoredAlarm) {
    save(context, getAll(context).filterNot { it.id == alarm.id } + alarm)
  }

  fun remove(context: Context, id: String) {
    save(context, getAll(context).filterNot { it.id == id })
  }

  private fun save(context: Context, alarms: List<StoredAlarm>) {
    val array = JSONArray()
    alarms.forEach { alarm ->
      array.put(
        JSONObject().apply {
          put("id", alarm.id)
          put("hour", alarm.hour)
          put("minute", alarm.minute)
          put("repeatDays", JSONArray(alarm.repeatDays))
          put("label", alarm.label)
        }
      )
    }
    prefs(context).edit().putString(KEY_ALARMS, array.toString()).apply()
  }

  private fun prefs(context: Context) =
    context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
}
