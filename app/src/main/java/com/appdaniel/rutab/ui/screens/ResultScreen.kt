package com.appdaniel.rutab.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.SessionKind
import com.appdaniel.rutab.data.Achievements
import com.appdaniel.rutab.ui.components.ChunkyButton
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.OutlinedPanel
import com.appdaniel.rutab.ui.theme.ConeOrange
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.Gold
import com.appdaniel.rutab.ui.theme.InfoBlue
import com.appdaniel.rutab.ui.theme.LocalExtra
import com.appdaniel.rutab.ui.theme.StopRed

@Composable
fun ResultScreen(vm: AppViewModel) {
    val r = vm.result ?: return
    BackHandler { vm.closeResult() }
    val extra = LocalExtra.current
    val isExam = r.kind == SessionKind.EXAM
    val good = if (isExam) r.passed else r.accuracy >= 70

    Column(
        Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).statusBarsPadding().navigationBarsPadding()
    ) {
        Column(
            Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(16.dp))
            Mascot(if (good) Mood.CHEER else Mood.SAD, size = 140.dp)
            Spacer(Modifier.height(12.dp))
            Text(
                when {
                    isExam && r.passed -> "¡Aprobaste el simulacro!"
                    isExam -> "Esta vez no alcanzó"
                    r.perfect -> "¡Lección perfecta!"
                    r.kind == SessionKind.REVIEW -> "¡Repaso completado!"
                    r.kind == SessionKind.UNIT_TEST -> "¡Unidad superada!"
                    else -> "¡Lección completada!"
                },
                style = MaterialTheme.typography.headlineMedium,
                color = if (good) GoGreen else ConeOrange,
                textAlign = TextAlign.Center,
            )
            Text(r.title, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
            Spacer(Modifier.height(20.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                if (isExam) {
                    ResultTile("PUNTAJE", "${r.points}/${r.maxPoints}", if (r.passed) GoGreen else StopRed, Modifier.weight(1f))
                    ResultTile("XP", "+${r.xp}", Gold, Modifier.weight(1f))
                } else {
                    ResultTile("XP", "+${r.xp}", Gold, Modifier.weight(1f))
                    ResultTile("PRECISIÓN", "${r.accuracy}%", GoGreen, Modifier.weight(1f))
                    ResultTile("TIEMPO", formatTime(r.seconds), InfoBlue, Modifier.weight(1f))
                }
            }

            if (r.streakIncreased) {
                Spacer(Modifier.height(14.dp))
                Banner("🔥", "¡Racha de ${r.streak} ${if (r.streak == 1) "día" else "días"}!", "Vuelve mañana para mantenerla.", ConeOrange)
            }
            if (r.goalReachedNow) {
                Spacer(Modifier.height(10.dp))
                Banner("🎯", "¡Meta diaria cumplida!", "Constancia > intensidad: estudiar un poco cada día rinde más.", GoGreen)
            }
            r.newAchievements.forEach { id ->
                val a = Achievements.byId(id)
                Spacer(Modifier.height(10.dp))
                Banner(a.icon, "Logro: ${a.title}", a.desc, Gold)
            }
            if (isExam) {
                Spacer(Modifier.height(14.dp))
                Text(
                    if (r.passed) "Necesitabas 33 puntos. ¡Sigue así hasta aprobar varias veces seguidas!"
                    else "Necesitas 33 puntos. Revisa tus errores: cada uno ya quedó agendado para tu repaso.",
                    textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (r.wrong.isNotEmpty()) {
                    Spacer(Modifier.height(16.dp))
                    Text("Tus errores (${r.wrong.size})", style = MaterialTheme.typography.titleMedium, modifier = Modifier.fillMaxWidth())
                    Spacer(Modifier.height(8.dp))
                    r.wrong.forEach { q ->
                        OutlinedPanel(Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                            Column(Modifier.padding(14.dp)) {
                                Text(q.prompt, fontWeight = FontWeight.SemiBold)
                                Spacer(Modifier.height(6.dp))
                                Text("✓ ${q.correctAnswerText()}", color = extra.correctFg, fontWeight = FontWeight.Bold)
                                Text(q.explain, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
                                Text("📖 Pág. ${q.page}", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
        Box(Modifier.padding(20.dp)) {
            ChunkyButton("Continuar", Modifier.fillMaxWidth()) { vm.closeResult() }
        }
    }
}

@Composable
private fun ResultTile(label: String, value: String, color: Color, modifier: Modifier) {
    Column(modifier.clip(RoundedCornerShape(16.dp)).background(color).padding(2.dp)) {
        Text(label, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), textAlign = TextAlign.Center)
        Box(
            Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(MaterialTheme.colorScheme.surface).padding(vertical = 12.dp),
            contentAlignment = Alignment.Center,
        ) { Text(value, color = color, fontSize = 22.sp, fontWeight = FontWeight.Black) }
    }
}

@Composable
private fun Banner(icon: String, title: String, sub: String, color: Color) {
    OutlinedPanel(Modifier.fillMaxWidth(), borderColor = color.copy(alpha = 0.6f)) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(icon, fontSize = 30.sp)
            Spacer(Modifier.width(12.dp))
            Column {
                Text(title, fontWeight = FontWeight.ExtraBold, color = color)
                Text(sub, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

private fun formatTime(s: Long) = "%d:%02d".format(s / 60, s % 60)
