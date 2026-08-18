package expo.modules.alarmscheduler

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat

/**
 * Foreground service that owns the ringing alarm: loops sound on
 * STREAM_ALARM (so it overrides silent/DND, per the Android alarm design
 * decision) and posts a full-screen-intent notification that deep-links
 * into the RN alarm-ringing screen via the app's `alarmbattles://` scheme.
 */
class AlarmRingingService : Service() {
  private var mediaPlayer: MediaPlayer? = null
  private var wakeLock: PowerManager.WakeLock? = null

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP_RINGING) {
      stopRinging()
      return START_NOT_STICKY
    }

    val alarmId = intent?.getStringExtra(AlarmReceiver.EXTRA_ALARM_ID) ?: run {
      stopSelf()
      return START_NOT_STICKY
    }
    startRinging(alarmId)
    return START_STICKY
  }

  private fun startRinging(alarmId: String) {
    ensureNotificationChannel()

    val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
    wakeLock = powerManager.newWakeLock(
      PowerManager.PARTIAL_WAKE_LOCK,
      "AlarmBattles:AlarmRingingWakeLock"
    ).apply { acquire(10 * 60 * 1000L) } // 10 min safety cap; stopRinging() releases it early

    startForeground(NOTIFICATION_ID, buildNotification(alarmId))
    playAlarmSound()
  }

  private fun playAlarmSound() {
    stopMediaPlayer()
    val soundUri = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
      ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
    mediaPlayer = MediaPlayer().apply {
      setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_ALARM)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build()
      )
      isLooping = true
      setDataSource(this@AlarmRingingService, soundUri)
      prepare()
      start()
    }
  }

  private fun stopRinging() {
    stopMediaPlayer()
    wakeLock?.let { if (it.isHeld) it.release() }
    wakeLock = null
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun stopMediaPlayer() {
    mediaPlayer?.apply {
      if (isPlaying) stop()
      release()
    }
    mediaPlayer = null
  }

  private fun buildNotification(alarmId: String): Notification {
    val deepLinkIntent = Intent(Intent.ACTION_VIEW, AlarmScheduling.ringingDeepLink(alarmId)).apply {
      setPackage(packageName)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    }
    val fullScreenIntent = PendingIntent.getActivity(
      this,
      AlarmScheduling.requestCode(alarmId),
      deepLinkIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
      .setContentTitle("Alarm Battles")
      .setContentText("Get up and move to silence the alarm")
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setFullScreenIntent(fullScreenIntent, true)
      .setContentIntent(fullScreenIntent)
      .setOngoing(true)
      .setAutoCancel(false)
      .build()
  }

  private fun ensureNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = getSystemService(NotificationManager::class.java) ?: return
    if (manager.getNotificationChannel(CHANNEL_ID) != null) return

    val channel = NotificationChannel(CHANNEL_ID, "Alarms", NotificationManager.IMPORTANCE_HIGH).apply {
      description = "Alarm Battles wake-up alarms"
      setSound(null, null) // sound is played manually via MediaPlayer on STREAM_ALARM
      enableVibration(true)
    }
    manager.createNotificationChannel(channel)
  }

  override fun onDestroy() {
    stopMediaPlayer()
    wakeLock?.let { if (it.isHeld) it.release() }
    super.onDestroy()
  }

  companion object {
    const val ACTION_START_RINGING = "expo.modules.alarmscheduler.action.START_RINGING"
    const val ACTION_STOP_RINGING = "expo.modules.alarmscheduler.action.STOP_RINGING"
    private const val CHANNEL_ID = "alarm_battles_alarms"
    private const val NOTIFICATION_ID = 42
  }
}
