package com.appdaniel.rutab.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.Session
import com.appdaniel.rutab.SessionKind
import com.appdaniel.rutab.data.Question
import com.appdaniel.rutab.ui.components.ChunkyButton
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.ProgressPill
import com.appdaniel.rutab.ui.components.SignView
import com.appdaniel.rutab.ui.theme.ConeOrange
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.Gold
import com.appdaniel.rutab.ui.theme.LocalExtra
import com.appdaniel.rutab.ui.theme.StopRed

@Composable
fun LessonScreen(vm: AppViewModel) {
    val s = vm.session ?: return
    val q = s.current ?: return
    var confirmExit by remember { mutableStateOf(false) }
    val haptic = LocalHapticFeedback.current
    BackHandler { confirmExit = true }

    val isExam = s.kind == SessionKind.EXAM
    val fb = s.feedback
    val key = s.attempt

    // Estado de respuesta por pregunta (se reinicia con cada intento).
    var choice by remember(key) { mutableStateOf<Int?>(null) }
    val orderPicked = remember(key) { mutableStateListOf<Int>() }
    val order = remember(key) { q.items.indices.shuffled() }
    val optionOrder = remember(key) {
        if (q.type == "tf") listOf(0, 1) else q.options.indices.shuffled()
    }

    fun isChoiceCorrect(idx: Int): Boolean =
        if (q.type == "tf") (idx == 0) == (q.answer == true) else idx == 0

    fun check() {
        val correct = when (q.type) {
            "order" -> orderPicked.toList() == q.items.indices.toList()
            else -> choice?.let { isChoiceCorrect(it) } ?: return
        }
        if (!correct && !isExam) haptic.performHapticFeedback(HapticFeedbackType.LongPress)
        vm.submit(correct)
    }

    val ready = when (q.type) {
        "order" -> orderPicked.size == q.items.size
        "match" -> false
        else -> choice != null
    }

    Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding()) {
            // Barra superior
            Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { confirmExit = true }) {
                    Icon(Icons.Filled.Close, contentDescription = "Salir", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                val anim by animateFloatAsState(s.progress, label = "p")
                ProgressPill(anim, if (isExam) Color(s.color) else GoGreen, Modifier.weight(1f))
                Spacer(Modifier.width(12.dp))
                if (isExam) {
                    Text("${s.examLog.size + 1}/${s.total}", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                } else {
                    Text("🔥 ${s.combo}", fontWeight = FontWeight.ExtraBold, color = if (s.combo >= 3) ConeOrange else MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Spacer(Modifier.width(8.dp))
            }

            Column(
                Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 20.dp)
            ) {
                Spacer(Modifier.height(8.dp))
                QuestionTag(q, s)
                Spacer(Modifier.height(10.dp))
                Text(q.prompt, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onBackground)
                Spacer(Modifier.height(18.dp))
                q.sign?.let {
                    Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { SignView(it, 140.dp) }
                    Spacer(Modifier.height(18.dp))
                }
                when (q.type) {
                    "order" -> OrderAnswer(q, order, orderPicked, locked = fb != null)
                    "match" -> MatchAnswer(q, key, locked = fb != null) { ok ->
                        if (!ok) haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        vm.submit(ok)
                    }
                    else -> {
                        val labels = if (q.type == "tf") listOf("Verdadero", "Falso") else q.options
                        optionOrder.forEachIndexed { i, idx ->
                            val state = when {
                                fb == null -> if (choice == idx) OptState.SELECTED else OptState.IDLE
                                isChoiceCorrect(idx) -> OptState.CORRECT
                                choice == idx -> OptState.WRONG
                                else -> OptState.DIM
                            }
                            OptionCard(
                                index = i + 1,
                                text = labels[idx],
                                state = state,
                                onClick = { if (fb == null) choice = idx },
                            )
                            Spacer(Modifier.height(10.dp))
                        }
                    }
                }
                // Deja espacio para desplazarse por debajo del panel de respuesta.
                Spacer(Modifier.height(if (fb != null) 300.dp else 24.dp))
            }

            if (fb == null && q.type != "match") {
                Box(Modifier.padding(horizontal = 20.dp, vertical = 14.dp)) {
                    ChunkyButton(
                        text = if (isExam) "Siguiente" else "Comprobar",
                        enabled = ready,
                        modifier = Modifier.fillMaxWidth(),
                        onClick = { check() },
                    )
                }
            }
        }

        AnimatedVisibility(
            visible = fb != null,
            enter = slideInVertically { it },
            exit = slideOutVertically { it },
            modifier = Modifier.align(Alignment.BottomCenter),
        ) {
            fb?.let { FeedbackPanel(it.correct, it.question, s.combo) { vm.next() } }
        }
    }

    if (confirmExit) {
        AlertDialog(
            onDismissRequest = { confirmExit = false },
            title = { Text("¿Salir de la sesión?") },
            text = { Text(if (isExam) "Perderás el avance de este simulacro." else "Lo que respondiste ya quedó guardado para tus repasos, pero no completarás la lección.") },
            confirmButton = { TextButton(onClick = { confirmExit = false; vm.quitSession() }) { Text("Salir", color = StopRed) } },
            dismissButton = { TextButton(onClick = { confirmExit = false }) { Text("Seguir estudiando") } },
        )
    }
}

@Composable
private fun QuestionTag(q: Question, s: Session) {
    val (text, color) = when {
        s.kind == SessionKind.EXAM && q.id in s.doubles -> "⭐ DOBLE PUNTAJE" to Gold
        s.isRetry -> "🔁 INTÉNTALO DE NUEVO" to ConeOrange
        q.type == "match" -> "🔗 UNE LAS PAREJAS" to MaterialTheme.colorScheme.tertiary
        q.type == "order" -> "🧩 ORDENA LOS PASOS" to MaterialTheme.colorScheme.tertiary
        q.type == "tf" -> "⚖️ VERDADERO O FALSO" to MaterialTheme.colorScheme.tertiary
        q.sign != null -> "🚦 SEÑAL" to GoGreen
        s.kind == SessionKind.REVIEW -> "🧠 REPASO" to Color(0xFF7048E8)
        else -> "❓ ELIGE LA RESPUESTA" to MaterialTheme.colorScheme.tertiary
    }
    Text(text, color = color, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp, letterSpacing = 0.6.sp)
}

enum class OptState { IDLE, SELECTED, CORRECT, WRONG, DIM }

@Composable
private fun OptionCard(index: Int, text: String, state: OptState, onClick: () -> Unit) {
    val extra = LocalExtra.current
    val border = when (state) {
        OptState.SELECTED -> MaterialTheme.colorScheme.tertiary
        OptState.CORRECT -> extra.correctFg
        OptState.WRONG -> extra.wrongFg
        else -> extra.outline
    }
    val bg = when (state) {
        OptState.SELECTED -> extra.selectedBg
        OptState.CORRECT -> extra.correctBg
        OptState.WRONG -> extra.wrongBg
        else -> MaterialTheme.colorScheme.surface
    }
    val fg = when (state) {
        OptState.SELECTED -> MaterialTheme.colorScheme.tertiary
        OptState.CORRECT -> extra.correctFg
        OptState.WRONG -> extra.wrongFg
        OptState.DIM -> MaterialTheme.colorScheme.onSurfaceVariant
        else -> MaterialTheme.colorScheme.onSurface
    }
    val shape = RoundedCornerShape(16.dp)
    Row(
        Modifier.fillMaxWidth().clip(shape).background(border).padding(start = 2.dp, end = 2.dp, top = 2.dp, bottom = 4.dp)
            .clip(RoundedCornerShape(14.dp)).background(bg).clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier.size(30.dp).border(2.dp, border, RoundedCornerShape(9.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                when (state) { OptState.CORRECT -> "✓"; OptState.WRONG -> "✕"; else -> "$index" },
                color = fg, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp,
            )
        }
        Spacer(Modifier.width(12.dp))
        Text(text, color = fg, style = MaterialTheme.typography.bodyLarge, fontWeight = if (state == OptState.IDLE || state == OptState.DIM) FontWeight.Normal else FontWeight.SemiBold)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun OrderAnswer(q: Question, bank: List<Int>, picked: MutableList<Int>, locked: Boolean) {
    val extra = LocalExtra.current
    // Zona de respuesta
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(16.dp))
            .border(2.dp, extra.outline, RoundedCornerShape(16.dp)).padding(10.dp)
            .heightIn(min = 70.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (picked.isEmpty()) {
            Text("Toca los pasos en el orden correcto", color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(8.dp))
        }
        picked.forEachIndexed { pos, idx ->
            val ok = locked && idx == pos
            val bad = locked && idx != pos
            Chip(
                "${pos + 1}. ${q.items[idx]}",
                bg = when { ok -> extra.correctBg; bad -> extra.wrongBg; else -> extra.selectedBg },
                fg = when { ok -> extra.correctFg; bad -> extra.wrongFg; else -> MaterialTheme.colorScheme.tertiary },
                modifier = Modifier.fillMaxWidth(),
            ) { if (!locked) picked.removeAt(pos) }
        }
    }
    Spacer(Modifier.height(16.dp))
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        bank.forEach { idx ->
            val used = idx in picked
            Chip(
                q.items[idx],
                bg = if (used) extra.locked else MaterialTheme.colorScheme.surface,
                fg = if (used) extra.locked else MaterialTheme.colorScheme.onSurface,
                border = if (used) extra.locked else extra.outline,
            ) { if (!used && !locked) picked.add(idx) }
        }
    }
}

@Composable
private fun Chip(text: String, bg: Color, fg: Color, modifier: Modifier = Modifier, border: Color = Color.Transparent, onClick: () -> Unit) {
    Box(
        modifier.clip(RoundedCornerShape(12.dp)).background(bg).border(2.dp, border, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick).padding(horizontal = 14.dp, vertical = 11.dp)
    ) { Text(text, color = fg, fontWeight = FontWeight.SemiBold, fontSize = 15.sp) }
}

@Composable
private fun MatchAnswer(q: Question, key: Int, locked: Boolean, onDone: (Boolean) -> Unit) {
    val extra = LocalExtra.current
    val left = remember(key) { q.pairs.indices.shuffled() }
    val right = remember(key) { q.pairs.indices.shuffled() }
    var selL by remember(key) { mutableStateOf<Int?>(null) }
    var selR by remember(key) { mutableStateOf<Int?>(null) }
    val matched = remember(key) { mutableStateListOf<Int>() }
    var wrongPair by remember(key) { mutableStateOf<Pair<Int, Int>?>(null) }
    var mistakes by remember(key) { mutableIntStateOf(0) }

    LaunchedEffect(selL, selR) {
        val l = selL; val r = selR
        if (l != null && r != null) {
            if (l == r) {
                matched.add(l)
                selL = null; selR = null
                if (matched.size == q.pairs.size) onDone(mistakes == 0)
            } else {
                mistakes++
                wrongPair = l to r
                kotlinx.coroutines.delay(450)
                wrongPair = null
                selL = null; selR = null
            }
        }
    }

    @Composable
    fun Cell(text: String, idx: Int, selected: Boolean, isWrong: Boolean, modifier: Modifier, onClick: () -> Unit) {
        val done = idx in matched
        val border = when { done -> extra.correctFg; isWrong -> extra.wrongFg; selected -> MaterialTheme.colorScheme.tertiary; else -> extra.outline }
        val bg = when { done -> extra.correctBg; isWrong -> extra.wrongBg; selected -> extra.selectedBg; else -> MaterialTheme.colorScheme.surface }
        Box(
            modifier.heightIn(min = 64.dp).clip(RoundedCornerShape(14.dp)).background(border)
                .padding(start = 2.dp, end = 2.dp, top = 2.dp, bottom = 4.dp)
                .clip(RoundedCornerShape(12.dp)).background(bg)
                .clickable(enabled = !done && !locked, onClick = onClick).padding(10.dp),
            contentAlignment = Alignment.Center,
        ) {
            Text(text, textAlign = TextAlign.Center, fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                color = if (done) extra.correctFg else MaterialTheme.colorScheme.onSurface)
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        for (row in q.pairs.indices) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                val l = left[row]; val r = right[row]
                Cell(q.pairs[l][0], l, selL == l, wrongPair?.first == l, Modifier.weight(1f)) { selL = l }
                Cell(q.pairs[r][1], r, selR == r, wrongPair?.second == r, Modifier.weight(1f)) { selR = r }
            }
        }
    }
}

@Composable
private fun FeedbackPanel(correct: Boolean, q: Question, combo: Int, onContinue: () -> Unit) {
    val extra = LocalExtra.current
    val bg = if (correct) extra.correctBg else extra.wrongBg
    val fg = if (correct) extra.correctFg else extra.wrongFg
    val praise = remember(q.id, correct) {
        if (correct) listOf("¡Excelente!", "¡Muy bien!", "¡Correcto!", "¡Así se conduce!", "¡Impecable!").random()
        else listOf("Casi…", "No exactamente", "¡Ojo con esta!").random()
    }
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp)).background(bg)
            .navigationBarsPadding().padding(20.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Mascot(if (correct) Mood.CHEER else Mood.SAD, size = 56.dp)
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(praise, color = fg, style = MaterialTheme.typography.titleLarge)
                if (correct && combo >= 3) Text("🔥 $combo seguidas", color = fg, fontWeight = FontWeight.Bold)
            }
        }
        if (!correct) {
            Spacer(Modifier.height(10.dp))
            Text("Respuesta correcta:", color = fg, fontWeight = FontWeight.ExtraBold)
            Text(q.correctAnswerText(), color = fg, style = MaterialTheme.typography.bodyLarge)
        }
        Spacer(Modifier.height(10.dp))
        Text(q.explain, color = fg.copy(alpha = 0.9f), style = MaterialTheme.typography.bodyMedium)
        Text("📖 Libro CONASET, pág. ${q.page}", color = fg.copy(alpha = 0.75f), fontSize = 13.sp, modifier = Modifier.padding(top = 6.dp))
        if (!correct) {
            Text("Volverá a aparecer al final para que la fijes.", color = fg.copy(alpha = 0.75f), fontSize = 13.sp)
        }
        Spacer(Modifier.height(14.dp))
        ChunkyButton(
            text = "Continuar",
            color = if (correct) GoGreen else StopRed,
            modifier = Modifier.fillMaxWidth(),
            onClick = onContinue,
        )
    }
}
