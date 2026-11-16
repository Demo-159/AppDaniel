package com.appdaniel.rutab.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.data.Srs
import com.appdaniel.rutab.ui.components.ChunkyButton
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.OutlinedPanel
import com.appdaniel.rutab.ui.components.ProgressPill
import com.appdaniel.rutab.ui.components.SectionTitle
import com.appdaniel.rutab.ui.components.Weight1
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.Purple
import com.appdaniel.rutab.ui.theme.StopRed
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun ReviewScreen(vm: AppViewModel) {
    val p = vm.progress
    val due = vm.dueCount()
    val weak = vm.weakCount()
    val seen = p.cards.size
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Mascot(if (due > 0) Mood.HAPPY else Mood.CHEER, size = 64.dp)
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text("Repaso inteligente", style = MaterialTheme.typography.titleLarge)
                        Text(
                            when {
                                seen == 0 -> "Primero completa alguna lección en la Ruta."
                                due == 0 -> "¡Al día! Vuelve mañana: las preguntas regresan justo antes de que se te olviden."
                                due == 1 -> "1 pregunta lista para repasar hoy."
                                else -> "$due preguntas listas para repasar hoy."
                            },
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
                Spacer(Modifier.height(14.dp))
                ChunkyButton(
                    if (due > 0) "Repasar ahora" else "Repasar igual",
                    Modifier.fillMaxWidth(),
                    color = Purple,
                    enabled = seen > 0,
                ) { vm.startReview(weakOnly = false) }
            }
        }
        Spacer(Modifier.height(12.dp))
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Text("🎯 Puntos débiles", style = MaterialTheme.typography.titleMedium)
                Text(
                    when (weak) {
                        0 -> "No tienes preguntas difíciles pendientes. ¡Bien!"
                        1 -> "1 pregunta que te ha costado. Practicarla es lo que más sube tu nota."
                        else -> "$weak preguntas que te han costado. Practicarlas es lo que más sube tu nota."
                    },
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(12.dp))
                ChunkyButton("Practicar errores", Modifier.fillMaxWidth(), color = StopRed, enabled = weak > 0) { vm.startReview(weakOnly = true) }
            }
        }

        SectionTitle("Memoria por unidad")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                vm.content.units.forEach { u ->
                    val m = vm.unitMastery(u.id)
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("${u.icon}  ${u.title}", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, modifier = Modifier.weight(1f))
                            Text("${(m * 100).toInt()}%", fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                        }
                        Spacer(Modifier.height(4.dp))
                        ProgressPill(m, Color(AppViewModel.parseColor(u.color)), Modifier.fillMaxWidth(), height = 10.dp)
                    }
                }
            }
        }

        SectionTitle("¿Cómo funciona?")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Cada pregunta tiene un nivel de memoria del 0 al ${Srs.MAX_BOX}. Si aciertas, sube de nivel y vuelve más tarde (1, 3, 7, 14 y 30 días). Si fallas, vuelve al nivel 0 y la repasas hoy.", style = MaterialTheme.typography.bodyMedium)
                Text("Esto se llama repetición espaciada: repasar justo antes de olvidar es una de las técnicas de estudio con más evidencia.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
fun ExamScreen(vm: AppViewModel) {
    val exams = vm.progress.exams
    val best = exams.maxByOrNull { it.points }
    val passedStreak = exams.reversed().takeWhile { it.passed }.size
    val fmt = DateTimeFormatter.ofPattern("d MMM", Locale.forLanguageTag("es-CL"))
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Text("📝 Simulacro de examen teórico", style = MaterialTheme.typography.titleLarge)
                Spacer(Modifier.height(8.dp))
                Text("• ${AppViewModel.EXAM_SIZE} preguntas de todas las unidades, mezcladas.")
                Text("• ${AppViewModel.EXAM_DOUBLES} preguntas valen doble (máximo 38 puntos).")
                Text("• Apruebas con 33 puntos o más.")
                Text("• Sin ayudas: verás tus errores al final, como en el examen real.")
                Spacer(Modifier.height(6.dp))
                Text(
                    "Formato de referencia. Confirma el formato vigente en tu municipalidad.",
                    fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(14.dp))
                ChunkyButton("Comenzar simulacro", Modifier.fillMaxWidth(), color = GoGreen) { vm.startExam() }
            }
        }
        if (exams.isNotEmpty()) {
            SectionTitle("Tus resultados")
            OutlinedPanel(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Mejor puntaje: ${best?.points}/${best?.max}", style = MaterialTheme.typography.titleMedium)
                    Text(
                        if (passedStreak >= 3) "¡Aprobaste $passedStreak seguidos! Estás listo/a para el examen. 🎉"
                        else "Meta: aprobar 3 simulacros seguidos. Llevas $passedStreak.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.height(10.dp))
                    exams.reversed().take(8).forEach { e ->
                        Row(Modifier.fillMaxWidth().padding(vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(if (e.passed) "✅" else "❌", fontSize = 18.sp)
                            Spacer(Modifier.width(10.dp))
                            Text(LocalDate.ofEpochDay(e.day).format(fmt), color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Weight1()
                            Text("${e.points}/${e.max} pts", fontWeight = FontWeight.ExtraBold, color = if (e.passed) GoGreen else StopRed)
                        }
                    }
                }
            }
        }
        SectionTitle("Consejo de estudio")
        OutlinedPanel(Modifier.fillMaxWidth()) {
            Text(
                "Hacer simulacros es práctica de recuperación: intentar recordar sin ver la respuesta fortalece la memoria mucho más que releer el libro. Después de cada intento, revisa con calma tus errores.",
                Modifier.padding(16.dp), style = MaterialTheme.typography.bodyMedium,
            )
        }
    }
}
