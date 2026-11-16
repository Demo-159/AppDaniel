package com.appdaniel.rutab.notify

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.appdaniel.rutab.MainActivity
import com.appdaniel.rutab.R
import com.appdaniel.rutab.data.ProgressStore
import java.time.Duration
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

/** Recordatorio diario: solo avisa si todavía no cumpliste tu meta del día. */
object Reminder {
    private const val WORK = "daily_reminder"
    const val CHANNEL = "recordatorios"

    fun schedule(ctx: Context, hour: Int) {
        val now = LocalDateTime.now()
        var next = now.withHour(hour).withMinute(0).withSecond(0).withNano(0)
        if (!next.isAfter(now)) next = next.plusDays(1)
        val delay = Duration.between(now, next).toMinutes()
        val req = PeriodicWorkRequestBuilder<ReminderWorker>(1, TimeUnit.DAYS)
            .setInitialDelay(delay, TimeUnit.MINUTES)
            .build()
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork(WORK, ExistingPeriodicWorkPolicy.UPDATE, req)
    }

    fun cancel(ctx: Context) = WorkManager.getInstance(ctx).cancelUniqueWork(WORK)

    fun ensureChannel(ctx: Context) {
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL, "Recordatorios de estudio", NotificationManager.IMPORTANCE_DEFAULT)
        )
    }
}

class ReminderWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        val p = ProgressStore(applicationContext).load()
        if (!p.reminder || p.todayXp() >= p.dailyGoal) return Result.success()
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(applicationContext, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) return Result.success()

        Reminder.ensureChannel(applicationContext)
        val streak = p.currentStreak()
        val text = if (streak > 0) "Llevas $streak ${if (streak == 1) "día" else "días"} de racha. ¡Una lección corta y la mantienes! 🔥"
        else "Cinco minutos al día bastan para llegar preparado al examen. 🚦"
        val intent = PendingIntent.getActivity(
            applicationContext, 0,
            Intent(applicationContext, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_IMMUTABLE,
        )
        val n = NotificationCompat.Builder(applicationContext, Reminder.CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_cone)
            .setContentTitle("Cono te espera en la ruta")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(intent)
            .setAutoCancel(true)
            .build()
        runCatching { NotificationManagerCompat.from(applicationContext).notify(1, n) }
        return Result.success()
    }
}
