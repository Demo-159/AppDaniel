package com.appdaniel.rutab.ui.screens

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.data.Achievements
import com.appdaniel.rutab.data.Levels
import com.appdaniel.rutab.data.today
import com.appdaniel.rutab.ui.components.ChoiceChipRow
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.OutlinedPanel
import com.appdaniel.rutab.ui.components.ProgressPill
import com.appdaniel.rutab.ui.components.SectionTitle
import com.appdaniel.rutab.ui.components.StatTile
import com.appdaniel.rutab.ui.components.Weight1
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.Gold
import com.appdaniel.rutab.ui.theme.LocalExtra
import com.appdaniel.rutab.ui.theme.StopRed
import java.time.LocalDate

val GOALS = listOf("Suave\n20 XP" to 20, "Normal\n50 XP" to 50, "Serio\n100 XP" to 100, "Intenso\n150 XP" to 150)

@Composable
fun ProfileScreen(vm: AppViewModel) {
    val p = vm.progress
    val extra = LocalExtra.current
    var confirmReset by remember { mutableStateOf(false) }
    var showMethods by remember { mutableStateOf(false) }
    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        vm.setReminder(granted)
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        // Encabezado
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Mascot(Mood.HAPPY, size = 72.dp)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(p.name.ifBlank { "Futuro/a conductor/a" }, style = MaterialTheme.typography.titleLarge)
                    Text("Nivel ${p.level}", color = Gold, fontWeight = FontWeight.ExtraBold)
                    val lo = Levels.xpForLevel(p.level)
                    val hi = Levels.xpForLevel(p.level + 1)
                    Spacer(Modifier.height(6.dp))
                    ProgressPill((p.xp - lo).toFloat() / (hi - lo), Gold, Modifier.fillMaxWidth(), height = 10.dp)
                    Text("${hi - p.xp} XP para el nivel ${p.level + 1}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }

        SectionTitle("Estadísticas")
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile("🔥", "${p.currentStreak()}", "Racha actual", Modifier.weight(1f))
            StatTile("🏅", "${p.bestStreak}", "Mejor racha", Modifier.weight(1f))
        }
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile("⚡", "${p.xp}", "XP total", Modifier.weight(1f))
            StatTile("🎯", "${p.accuracy}%", "Precisión", Modifier.weight(1f))
        }
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            val learned = p.cards.values.count { it.box >= 3 }
            StatTile("🧠", "$learned/${vm.content.questions.size}", "Bien aprendidas", Modifier.weight(1f))
            StatTile("📘", "${p.completed.size}/${vm.nodes.size}", "Lecciones", Modifier.weight(1f))
        }

        SectionTitle("Esta semana")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            val t = today()
            val days = (6 downTo 0).map { t - it }
            val max = maxOf(p.dailyGoal, days.maxOf { p.xpByDay[it] ?: 0 })
            Row(Modifier.fillMaxWidth().height(150.dp).padding(14.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Bottom) {
                days.forEach { d ->
                    val xp = p.xpByDay[d] ?: 0
                    Column(Modifier.weight(1f).fillMaxHeight(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                        Text(if (xp > 0) "$xp" else "", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Box(
                            Modifier.width(22.dp).fillMaxHeight(fraction = (xp.toFloat() / max).coerceIn(0.03f, 1f) * 0.75f)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (xp >= p.dailyGoal) GoGreen else if (xp > 0) Gold else extra.locked)
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(dayInitial(d), fontSize = 12.sp, fontWeight = if (d == t) FontWeight.Black else FontWeight.Normal)
                    }
                }
            }
        }

        SectionTitle("Logros (${p.achievements.size}/${Achievements.all.size})")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(12.dp)) {
                Achievements.all.chunked(3).forEach { row ->
                    Row(Modifier.fillMaxWidth()) {
                        row.forEach { a ->
                            val got = a.id in p.achievements
                            Column(
                                Modifier.weight(1f).padding(6.dp).alpha(if (got) 1f else 0.4f),
                                horizontalAlignment = Alignment.CenterHorizontally,
                            ) {
                                Box(
                                    Modifier.clip(RoundedCornerShape(16.dp)).background(if (got) Gold.copy(alpha = 0.18f) else extra.locked).padding(12.dp)
                                ) { Text(if (got) a.icon else "🔒", fontSize = 26.sp) }
                                Spacer(Modifier.height(4.dp))
                                Text(a.title, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                                Text(a.desc, fontSize = 10.sp, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 12.sp)
                            }
                        }
                        repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
                    }
                }
            }
        }

        SectionTitle("Ajustes")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Meta diaria", fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                ChoiceChipRow(GOALS, p.dailyGoal) { vm.setGoal(it) }
                Spacer(Modifier.height(16.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text("Recordatorio diario", fontWeight = FontWeight.Bold)
                        Text("Solo si aún no cumples tu meta", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Switch(
                        checked = p.reminder,
                        onCheckedChange = { on ->
                            if (on && Build.VERSION.SDK_INT >= 33) permission.launch(Manifest.permission.POST_NOTIFICATIONS)
                            else vm.setReminder(on)
                        },
                        colors = SwitchDefaults.colors(checkedTrackColor = GoGreen),
                    )
                }
                if (p.reminder) {
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Hora:", modifier = Modifier.padding(end = 8.dp))
                        TextButton(onClick = { vm.setReminder(true, (p.reminderHour + 23) % 24) }) { Text("−", fontSize = 22.sp) }
                        Text("%02d:00".format(p.reminderHour), fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                        TextButton(onClick = { vm.setReminder(true, (p.reminderHour + 1) % 24) }) { Text("+", fontSize = 22.sp) }
                    }
                }
                Spacer(Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text("Desbloquear toda la ruta", fontWeight = FontWeight.Bold)
                        Text("Para estudiar cualquier unidad en el orden que quieras", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Switch(checked = p.unlockAll, onCheckedChange = { vm.setUnlockAll(it) }, colors = SwitchDefaults.colors(checkedTrackColor = GoGreen))
                }
                Spacer(Modifier.height(8.dp))
                Row {
                    TextButton(onClick = { showMethods = true }) { Text("🔬 Cómo aprendes con Ruta B") }
                    Weight1()
                    TextButton(onClick = { confirmReset = true }) { Text("Reiniciar", color = StopRed) }
                }
            }
        }
        Spacer(Modifier.height(10.dp))
        Text(
            "Contenido basado en el “Libro para la Conducción en Chile – Clase B” (CONASET, febrero 2026). App de estudio independiente, sin afiliación oficial.",
            fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(16.dp))
    }

    if (confirmReset) {
        AlertDialog(
            onDismissRequest = { confirmReset = false },
            title = { Text("¿Reiniciar el progreso?") },
            text = { Text("Se borrarán tu XP, racha, logros, lecciones completadas y la memoria de cada pregunta. No se puede deshacer.") },
            confirmButton = { TextButton(onClick = { vm.resetProgress(); confirmReset = false }) { Text("Reiniciar", color = StopRed) } },
            dismissButton = { TextButton(onClick = { confirmReset = false }) { Text("Cancelar") } },
        )
    }
    if (showMethods) {
        AlertDialog(
            onDismissRequest = { showMethods = false },
            title = { Text("Cómo aprendes con Ruta B") },
            text = {
                Column(Modifier.verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Method("🧠", "Práctica de recuperación", "Responder preguntas fija más que releer. Cada lección es un mini examen, no una lectura.")
                    Method("📅", "Repetición espaciada", "Las preguntas vuelven en 1, 3, 7, 14 y 30 días, justo antes de que las olvides.")
                    Method("🔀", "Práctica intercalada", "Las pruebas de unidad, los repasos y los simulacros mezclan temas, como el examen real.")
                    Method("💬", "Retroalimentación inmediata", "Cada respuesta trae su explicación y la página del libro. Si fallas, la pregunta vuelve al final.")
                    Method("🧩", "Variedad de formatos", "Opción múltiple, verdadero/falso, señales, unir parejas y ordenar pasos.")
                    Method("🔥", "Hábito diario", "Racha, meta diaria y recordatorio: estudiar poco cada día rinde más que mucho en una noche.")
                    Text("Sin vidas ni castigos por errar: equivocarse es parte de aprender.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            },
            confirmButton = { TextButton(onClick = { showMethods = false }) { Text("Entendido") } },
        )
    }
}

@Composable
private fun Method(icon: String, title: String, body: String) {
    Row {
        Text(icon, fontSize = 22.sp)
        Spacer(Modifier.width(10.dp))
        Column {
            Text(title, fontWeight = FontWeight.Bold)
            Text(body, fontSize = 14.sp)
        }
    }
}

private fun dayInitial(epochDay: Long): String =
    when (LocalDate.ofEpochDay(epochDay).dayOfWeek.value) { 1 -> "L"; 2 -> "M"; 3 -> "M"; 4 -> "J"; 5 -> "V"; 6 -> "S"; else -> "D" }
