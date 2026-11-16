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
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.Screen
import com.appdaniel.rutab.data.StudyUnit
import com.appdaniel.rutab.ui.components.ChoiceChipRow
import com.appdaniel.rutab.ui.components.ChunkyButton
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.OutlinedPanel
import com.appdaniel.rutab.ui.theme.GoGreen

@Composable
fun GuideScreen(vm: AppViewModel, unit: StudyUnit) {
    BackHandler { vm.screen = Screen.Home }
    val c = Color(AppViewModel.parseColor(unit.color))
    Column(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(Modifier.fillMaxWidth().background(c).statusBarsPadding().padding(bottom = 18.dp)) {
            IconButton(onClick = { vm.screen = Screen.Home }) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = Color.White)
            }
            Column(Modifier.padding(horizontal = 20.dp)) {
                Text("${unit.icon}  GUÍA · ${unit.chapter.uppercase()}", color = Color.White.copy(alpha = 0.85f), fontWeight = FontWeight.ExtraBold, fontSize = 13.sp)
                Text(unit.title, color = Color.White, style = MaterialTheme.typography.headlineMedium)
                Text("Ideas clave para recordar", color = Color.White.copy(alpha = 0.9f))
            }
        }
        Column(
            Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            unit.guide.forEachIndexed { i, tip ->
                OutlinedPanel(Modifier.fillMaxWidth()) {
                    Row(Modifier.padding(14.dp)) {
                        Box(Modifier.size(28.dp).clip(CircleShape).background(c), contentAlignment = Alignment.Center) {
                            Text("${i + 1}", color = Color.White, fontWeight = FontWeight.Black, fontSize = 14.sp)
                        }
                        Spacer(Modifier.width(12.dp))
                        Text(tip, style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }
            Text(
                "Consejo: lee la guía una vez y luego ponte a prueba. Intentar recordar fija mucho más que releer.",
                color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp, modifier = Modifier.padding(top = 6.dp),
            )
        }
        Box(Modifier.navigationBarsPadding().padding(16.dp)) {
            ChunkyButton("Ponerme a prueba", Modifier.fillMaxWidth(), color = c) {
                val node = vm.nodes.firstOrNull { it.unit.id == unit.id && vm.isUnlocked(it.key) && it.key !in vm.progress.completed }
                    ?: vm.nodes.first { it.unit.id == unit.id && it.lesson == 0 }
                if (vm.isUnlocked(node.key)) vm.startNode(node) else vm.screen = Screen.Home
            }
        }
    }
}

@Composable
fun OnboardingScreen(vm: AppViewModel) {
    var step by remember { mutableIntStateOf(0) }
    var name by remember { mutableStateOf("") }
    var goal by remember { mutableIntStateOf(50) }
    Column(
        Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).statusBarsPadding().navigationBarsPadding().imePadding()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()), horizontalAlignment = Alignment.CenterHorizontally) {
            Spacer(Modifier.height(24.dp))
            Mascot(Mood.CHEER, size = 150.dp)
            Spacer(Modifier.height(16.dp))
            if (step == 0) {
                Text("¡Hola! Soy Cono 🚧", style = MaterialTheme.typography.headlineMedium, textAlign = TextAlign.Center)
                Spacer(Modifier.height(10.dp))
                Text(
                    "Te ayudaré a preparar el examen teórico de la licencia Clase B con lecciones cortas, repasos inteligentes y simulacros.",
                    textAlign = TextAlign.Center, style = MaterialTheme.typography.bodyLarge,
                )
                Spacer(Modifier.height(18.dp))
                OutlinedPanel(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("📚 265 preguntas basadas en el libro oficial de CONASET")
                        Text("🧠 Repasos que vuelven justo antes de que olvides")
                        Text("📝 Simulacros con el formato del examen")
                        Text("🔥 Racha, XP, niveles y logros")
                    }
                }
                Spacer(Modifier.height(18.dp))
                OutlinedTextField(
                    value = name, onValueChange = { name = it.take(24) },
                    label = { Text("¿Cómo te llamas? (opcional)") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                    modifier = Modifier.fillMaxWidth(),
                )
            } else {
                Text("¿Cuánto quieres estudiar al día?", style = MaterialTheme.typography.headlineMedium, textAlign = TextAlign.Center)
                Spacer(Modifier.height(10.dp))
                Text(
                    "Una lección da entre 60 y 120 XP. Lo importante es la constancia: mejor poco cada día que todo de una vez.",
                    textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(20.dp))
                ChoiceChipRow(GOALS, goal) { goal = it }
            }
        }
        ChunkyButton(if (step == 0) "Continuar" else "¡Empezar!", Modifier.fillMaxWidth(), color = GoGreen) {
            if (step == 0) step = 1 else vm.finishOnboarding(name, goal)
        }
    }
}
