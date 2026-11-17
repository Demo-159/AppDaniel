package com.appdaniel.rutab

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import com.appdaniel.rutab.data.Achievements
import com.appdaniel.rutab.data.Content
import com.appdaniel.rutab.data.ContentRepo
import com.appdaniel.rutab.data.ExamResult
import com.appdaniel.rutab.data.Progress
import com.appdaniel.rutab.data.ProgressStorage
import com.appdaniel.rutab.data.ProgressStore
import com.appdaniel.rutab.data.Question
import com.appdaniel.rutab.data.Srs
import com.appdaniel.rutab.data.StudyUnit
import com.appdaniel.rutab.data.today
import com.appdaniel.rutab.notify.Reminder

sealed interface Screen {
    data object Onboarding : Screen
    data object Home : Screen
    data object Study : Screen
    data object Result : Screen
    data class Guide(val unitId: String) : Screen
}

enum class Tab { PATH, REVIEW, EXAM, PROFILE }

/** Un nodo del camino: una lección o la prueba final de una unidad. */
data class PathNode(val unit: StudyUnit, val unitIndex: Int, val lesson: Int?, val key: String, val title: String)

class AppViewModel @JvmOverloads constructor(
    app: Application,
    contentOverride: Content? = null,
    storeOverride: ProgressStorage? = null,
) : AndroidViewModel(app) {
    val content: Content = contentOverride ?: ContentRepo.load(app)
    private val store: ProgressStorage = storeOverride ?: ProgressStore(app)

    var progress by mutableStateOf(store.load()); private set
    var screen by mutableStateOf<Screen>(if (progress.onboarded) Screen.Home else Screen.Onboarding)
    var tab by mutableStateOf(Tab.PATH)
    var session by mutableStateOf<Session?>(null); private set
    var result by mutableStateOf<SessionResult?>(null); private set

    private val byUnit: Map<String, List<Question>> = content.questions.groupBy { it.unit }
    fun unitById(id: String) = content.units.first { it.id == id }
    fun questionsOfUnit(id: String) = byUnit[id].orEmpty()

    val nodes: List<PathNode> = buildList {
        content.units.forEachIndexed { ui, u ->
            u.lessons.forEachIndexed { li, t -> add(PathNode(u, ui, li, "${u.id}:$li", t)) }
            add(PathNode(u, ui, null, "${u.id}:test", "Prueba de la unidad"))
        }
    }

    /** Sin bloqueos: todo el contenido está siempre disponible. */
    @Suppress("UNUSED_PARAMETER")
    fun isUnlocked(key: String): Boolean = true

    /** Primer nodo desbloqueado y no completado: "donde vas". */
    val currentNodeKey: String?
        get() = nodes.firstOrNull { it.key !in progress.completed && isUnlocked(it.key) }?.key

    fun unitMastery(unitId: String): Float =
        Srs.mastery(progress.cards, questionsOfUnit(unitId).map { it.id })

    fun dueCount(): Int { val t = today(); return progress.cards.values.count { it.due <= t } }
    fun weakCount(): Int = progress.cards.values.count { it.wrong > 0 && it.box <= 2 }

    // ---------- Configuración ----------

    private fun update(block: (Progress) -> Progress) {
        progress = block(progress)
        store.save(progress)
    }

    fun finishOnboarding(name: String, goal: Int) {
        update { it.copy(onboarded = true, name = name.trim(), dailyGoal = goal) }
        screen = Screen.Home
    }

    fun setGoal(goal: Int) = update { it.copy(dailyGoal = goal) }
    fun setName(name: String) = update { it.copy(name = name.trim()) }

    fun setReminder(enabled: Boolean, hour: Int = progress.reminderHour) {
        update { it.copy(reminder = enabled, reminderHour = hour) }
        val ctx = getApplication<Application>()
        if (enabled) Reminder.schedule(ctx, hour) else Reminder.cancel(ctx)
    }

    fun resetProgress() {
        val keep = progress
        update { Progress(onboarded = true, name = keep.name, dailyGoal = keep.dailyGoal, reminder = keep.reminder, reminderHour = keep.reminderHour) }
        tab = Tab.PATH
    }

    // ---------- Inicio de sesiones ----------

    fun startNode(node: PathNode) {
        val qs = if (node.lesson != null) {
            questionsOfUnit(node.unit.id).filter { it.lesson == node.lesson }.shuffled()
        } else {
            // Prueba de unidad: mezcla de todas las lecciones (práctica intercalada).
            questionsOfUnit(node.unit.id).shuffled().take(12)
        }
        val kind = if (node.lesson != null) SessionKind.LESSON else SessionKind.UNIT_TEST
        val title = if (node.lesson != null) node.title else "Prueba: ${node.unit.title}"
        begin(Session(kind, title, parseColor(node.unit.color), node.key, qs))
    }

    fun startReview(weakOnly: Boolean) {
        val t = today()
        val cards = progress.cards
        val ids: List<String> = if (weakOnly) {
            cards.filter { it.value.wrong > 0 && it.value.box <= 2 }.entries
                .sortedByDescending { it.value.wrong - it.value.right }.map { it.key }
        } else {
            val due = cards.filter { it.value.due <= t }.entries
                .sortedWith(compareBy({ it.value.box }, { it.value.due })).map { it.key }
            if (due.size >= 5) due else (due + cards.entries.sortedBy { it.value.box }.map { it.key }).distinct()
        }
        val byId = content.questions.associateBy { it.id }
        val qs = ids.take(12).mapNotNull { byId[it] }.shuffled()
        if (qs.isEmpty()) return
        begin(Session(SessionKind.REVIEW, if (weakOnly) "Puntos débiles" else "Repaso inteligente", 0xFF7048E8, null, qs))
    }

    fun startExam() {
        // 35 preguntas de selección (como el examen municipal), repartidas entre todas las unidades.
        val pool = content.questions.filter { it.isChoice || it.type == "tf" || it.type == "multi" }.groupBy { it.unit }
            .mapValues { it.value.shuffled() }
        val picked = mutableListOf<Question>()
        var round = 0
        while (picked.size < EXAM_SIZE) {
            var added = false
            for (u in content.units) {
                val list = pool[u.id].orEmpty()
                if (round < list.size && picked.size < EXAM_SIZE) { picked += list[round]; added = true }
            }
            if (!added) break
            round++
        }
        val qs = picked.shuffled()
        val doubles = qs.filter { it.type != "tf" }.shuffled().take(EXAM_DOUBLES).map { it.id }.toSet()
        begin(Session(SessionKind.EXAM, "Simulacro de examen", 0xFF2B8A3E, null, qs, doubles))
    }

    private fun begin(s: Session) {
        session = s
        result = null
        screen = Screen.Study
    }

    fun quitSession() {
        session = null
        screen = Screen.Home
    }

    // ---------- Respuestas ----------

    fun submit(correct: Boolean) {
        val s = session ?: return
        val q = s.current ?: return
        val first = s.submit(correct)
        if (first) recordAnswer(q, correct, review = s.kind == SessionKind.REVIEW)
        if (s.kind == SessionKind.EXAM && s.isDone) finish()
    }

    fun next() {
        val s = session ?: return
        if (!s.next()) finish()
    }

    private fun recordAnswer(q: Question, correct: Boolean, review: Boolean) {
        val t = today()
        update { p ->
            p.copy(
                cards = p.cards + (q.id to Srs.update(p.cards[q.id], correct, t)),
                totalAnswered = p.totalAnswered + 1,
                totalCorrect = p.totalCorrect + if (correct) 1 else 0,
                reviewAnswered = p.reviewAnswered + if (review) 1 else 0,
            )
        }
    }

    private fun finish() {
        val s = session ?: return
        val t = today()
        val before = progress
        val firstAnswers = s.firstTry.values
        val accuracy = if (firstAnswers.isEmpty()) 0 else firstAnswers.count { it } * 100 / firstAnswers.size
        val perfect = s.kind != SessionKind.EXAM && s.mistakes == 0 && s.total > 0

        var xp = s.xp
        var points = 0; var maxPoints = 0; var passed = false
        val wrong = mutableListOf<Question>()
        if (s.kind == SessionKind.EXAM) {
            s.examLog.forEach { (q, ok) ->
                val w = if (q.id in s.doubles) 2 else 1
                maxPoints += w
                if (ok) points += w else wrong += q
            }
            passed = points >= examPassMark(maxPoints)
            xp = s.examLog.count { it.second } * 2 + if (passed) 25 else 0
        } else if (perfect && s.kind != SessionKind.REVIEW) {
            xp += 10
        }

        // Racha: cuenta el día en que completas al menos una sesión.
        val newStreak = when (before.lastStudyDay) {
            t -> before.streak
            t - 1 -> before.streak + 1
            else -> 1
        }
        val todayBefore = before.todayXp(t)
        val xpByDay = (before.xpByDay + (t to todayBefore + xp)).filterKeys { it > t - 30 }

        var p = before.copy(
            xp = before.xp + xp,
            xpByDay = xpByDay,
            streak = newStreak,
            bestStreak = maxOf(before.bestStreak, newStreak),
            lastStudyDay = t,
            completed = if (s.nodeKey != null) before.completed + s.nodeKey else before.completed,
            perfectCount = before.perfectCount + if (perfect && s.kind != SessionKind.REVIEW) 1 else 0,
            exams = if (s.kind == SessionKind.EXAM)
                (before.exams + ExamResult(t, points, maxPoints, s.examLog.count { it.second }, s.total, passed)).takeLast(20)
            else before.exams,
        )
        val earned = Achievements.earned(p, content)
        val fresh = (earned - p.achievements).toList()
        p = p.copy(achievements = p.achievements + earned)
        progress = p
        store.save(p)

        result = SessionResult(
            kind = s.kind,
            title = s.title,
            xp = xp,
            accuracy = accuracy,
            perfect = perfect,
            maxCombo = s.maxCombo,
            seconds = (System.currentTimeMillis() - s.startedAt) / 1000,
            newAchievements = fresh,
            streak = newStreak,
            streakIncreased = before.lastStudyDay != t,
            goalReachedNow = todayBefore < p.dailyGoal && todayBefore + xp >= p.dailyGoal,
            points = points,
            maxPoints = maxPoints,
            passed = passed,
            wrong = wrong,
        )
        session = null
        screen = Screen.Result
    }

    fun closeResult() {
        result = null
        screen = Screen.Home
    }

    companion object {
        const val EXAM_SIZE = 35
        const val EXAM_DOUBLES = 3
        /** Formato de referencia: 33 de 38 puntos. Se escala si el banco tuviera menos preguntas. */
        fun examPassMark(maxPoints: Int): Int = if (maxPoints == 38) 33 else (maxPoints * 33 + 37) / 38
        fun parseColor(hex: String): Long = ("FF" + hex.removePrefix("#")).toLong(16)
    }
}
