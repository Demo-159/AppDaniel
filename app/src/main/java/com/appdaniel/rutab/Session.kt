package com.appdaniel.rutab

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.appdaniel.rutab.data.Question

enum class SessionKind { LESSON, UNIT_TEST, REVIEW, EXAM }

data class Feedback(val correct: Boolean, val question: Question)

/**
 * Una sesión de estudio. En lecciones y repasos, una pregunta mal respondida vuelve al final de la
 * cola hasta que la aciertes (práctica de recuperación con corrección inmediata).
 * En el simulacro no hay retroalimentación hasta el final, como en el examen real.
 */
class Session(
    val kind: SessionKind,
    val title: String,
    val color: Long,
    val nodeKey: String?,
    questions: List<Question>,
    val doubles: Set<String> = emptySet(),
) {
    val total = questions.size
    private val queue = ArrayDeque(questions)

    var current by mutableStateOf(queue.firstOrNull()); private set
    /** Cambia con cada pregunta mostrada (también al repetir una), para reiniciar el estado de la UI. */
    var attempt by mutableIntStateOf(0); private set
    var feedback by mutableStateOf<Feedback?>(null); private set
    var solved by mutableIntStateOf(0); private set
    var combo by mutableIntStateOf(0); private set
    var maxCombo = 0; private set
    var xp = 0; private set
    var mistakes = 0; private set

    val firstTry = LinkedHashMap<String, Boolean>()
    private val requeued = mutableSetOf<String>()
    val examLog = mutableListOf<Pair<Question, Boolean>>()
    val startedAt = System.currentTimeMillis()

    /** La pregunta actual es una que fallaste antes en esta sesión. */
    val isRetry: Boolean get() = current?.let { it.id in requeued } ?: false

    val progress: Float
        get() = if (total == 0) 1f else if (kind == SessionKind.EXAM) examLog.size / total.toFloat() else solved / total.toFloat()

    /** Registra la respuesta. Devuelve true si fue el primer intento con esa pregunta. */
    fun submit(correct: Boolean): Boolean {
        val q = current ?: return false
        val first = q.id !in firstTry
        if (first) firstTry[q.id] = correct
        if (kind == SessionKind.EXAM) {
            examLog += q to correct
            queue.removeFirst()
            current = queue.firstOrNull()
            attempt++
            return first
        }
        if (correct) {
            solved++
            combo++
            maxCombo = maxOf(maxCombo, combo)
            xp += if (first) 10 else 5
            if (combo > 0 && combo % 5 == 0) xp += 5
        } else {
            combo = 0
            mistakes++
        }
        feedback = Feedback(correct, q)
        return first
    }

    /** Pasa a la siguiente pregunta. Devuelve false si la sesión terminó. */
    fun next(): Boolean {
        val fb = feedback
        val q = queue.removeFirstOrNull()
        if (q != null && fb != null && !fb.correct) { queue.addLast(q); requeued += q.id }
        feedback = null
        attempt++
        current = queue.firstOrNull()
        return current != null
    }

    val isDone get() = current == null
}

data class SessionResult(
    val kind: SessionKind,
    val title: String,
    val xp: Int,
    val accuracy: Int,
    val perfect: Boolean,
    val maxCombo: Int,
    val seconds: Long,
    val newAchievements: List<String>,
    val streak: Int,
    val streakIncreased: Boolean,
    val goalReachedNow: Boolean,
    // Solo simulacro
    val points: Int = 0,
    val maxPoints: Int = 0,
    val passed: Boolean = false,
    val wrong: List<Question> = emptyList(),
)
