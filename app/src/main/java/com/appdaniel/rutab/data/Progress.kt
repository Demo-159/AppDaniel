package com.appdaniel.rutab.data

import android.content.Context
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.time.LocalDate

/** Estado de una pregunta en el sistema de repetición espaciada (cajas de Leitner). */
@Serializable
data class Card(
    val box: Int = 0,
    val due: Long = 0,
    val seen: Int = 0,
    val right: Int = 0,
    val wrong: Int = 0,
)

@Serializable
data class ExamResult(val day: Long, val points: Int, val max: Int, val correct: Int, val total: Int, val passed: Boolean)

@Serializable
data class Progress(
    val onboarded: Boolean = false,
    val name: String = "",
    val xp: Int = 0,
    val dailyGoal: Int = 50,
    val streak: Int = 0,
    val bestStreak: Int = 0,
    val lastStudyDay: Long = -1,
    val xpByDay: Map<Long, Int> = emptyMap(),
    val completed: Set<String> = emptySet(),
    val cards: Map<String, Card> = emptyMap(),
    val achievements: Set<String> = emptySet(),
    val exams: List<ExamResult> = emptyList(),
    val totalAnswered: Int = 0,
    val totalCorrect: Int = 0,
    val reviewAnswered: Int = 0,
    val perfectCount: Int = 0,
    val reminder: Boolean = false,
    val reminderHour: Int = 19,
    val unlockAll: Boolean = false,
) {
    fun todayXp(today: Long = today()): Int = xpByDay[today] ?: 0

    /** La racha se pierde si no estudiaste ni hoy ni ayer. */
    fun currentStreak(today: Long = today()): Int =
        if (lastStudyDay >= today - 1) streak else 0

    val accuracy: Int get() = if (totalAnswered == 0) 0 else (totalCorrect * 100 / totalAnswered)

    val level: Int get() = Levels.levelFor(xp)
}

object Levels {
    /** XP acumulada necesaria para llegar al nivel n (nivel 1 = 0 XP). */
    fun xpForLevel(n: Int): Int = 50 * (n - 1) * n
    fun levelFor(xp: Int): Int {
        var n = 1
        while (xpForLevel(n + 1) <= xp) n++
        return n
    }
}

fun today(): Long = LocalDate.now().toEpochDay()

interface ProgressStorage {
    fun load(): Progress
    fun save(p: Progress)
}

class InMemoryStorage(private var p: Progress = Progress()) : ProgressStorage {
    override fun load() = p
    override fun save(p: Progress) { this.p = p }
}

class ProgressStore(context: Context) : ProgressStorage {
    private val prefs = context.getSharedPreferences("rutab", Context.MODE_PRIVATE)
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    override fun load(): Progress = prefs.getString(KEY, null)?.let {
        runCatching { json.decodeFromString<Progress>(it) }.getOrNull()
    } ?: Progress()

    override fun save(p: Progress) {
        prefs.edit().putString(KEY, json.encodeToString(Progress.serializer(), p)).apply()
    }

    companion object { private const val KEY = "progress_v1" }
}
