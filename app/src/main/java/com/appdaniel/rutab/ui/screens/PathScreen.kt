package com.appdaniel.rutab.ui.screens

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.PathNode
import com.appdaniel.rutab.Screen
import com.appdaniel.rutab.data.StudyUnit
import com.appdaniel.rutab.ui.components.ChunkyButton
import com.appdaniel.rutab.ui.components.Mascot
import com.appdaniel.rutab.ui.components.Mood
import com.appdaniel.rutab.ui.components.OutlinedPanel
import com.appdaniel.rutab.ui.components.ProgressPill
import com.appdaniel.rutab.ui.theme.Gold
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.LocalExtra
import com.appdaniel.rutab.ui.theme.darker

private sealed interface PathItem {
    data object Greeting : PathItem
    data class Header(val unit: StudyUnit, val index: Int) : PathItem
    data class Node(val node: PathNode, val globalIndex: Int) : PathItem
    data object Finish : PathItem
}

@Composable
fun PathScreen(vm: AppViewModel) {
    val items = remember {
        buildList {
            add(PathItem.Greeting)
            var last: String? = null
            vm.nodes.forEachIndexed { i, n ->
                if (n.unit.id != last) { add(PathItem.Header(n.unit, n.unitIndex)); last = n.unit.id }
                add(PathItem.Node(n, i))
            }
            add(PathItem.Finish)
        }
    }
    var pending by remember { mutableStateOf<PathNode?>(null) }
    var lockedMsg by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val currentKey = vm.currentNodeKey

    LaunchedEffect(Unit) {
        val idx = items.indexOfFirst { it is PathItem.Node && it.node.key == currentKey }
        if (idx > 3) listState.scrollToItem((idx - 2).coerceAtLeast(0))
    }

    LazyColumn(state = listState, modifier = Modifier.fillMaxWidth(), contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 32.dp)) {
        items(items, key = {
            when (it) {
                PathItem.Greeting -> "greet"; PathItem.Finish -> "finish"
                is PathItem.Header -> "h-${it.unit.id}"; is PathItem.Node -> it.node.key
            }
        }) { item ->
            when (item) {
                PathItem.Greeting -> Greeting(vm)
                is PathItem.Header -> UnitHeader(item.unit, item.index, vm.unitMastery(item.unit.id)) {
                    vm.screen = Screen.Guide(item.unit.id)
                }
                is PathItem.Node -> {
                    val n = item.node
                    val done = n.key in vm.progress.completed
                    val unlocked = vm.isUnlocked(n.key)
                    NodeRow(n, item.globalIndex, done, unlocked, n.key == currentKey) {
                        if (unlocked) pending = n else lockedMsg = true
                    }
                }
                PathItem.Finish -> FinishLine(vm)
            }
        }
    }

    pending?.let { n ->
        val count = if (n.lesson != null) vm.questionsOfUnit(n.unit.id).count { it.lesson == n.lesson } else 12
        val done = n.key in vm.progress.completed
        AlertDialog(
            onDismissRequest = { pending = null },
            title = { Text(if (n.lesson != null) n.title else "🏆 Prueba de la unidad") },
            text = {
                Column {
                    Text(n.unit.title, color = Color(AppViewModel.parseColor(n.unit.color)), fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(6.dp))
                    Text(
                        if (n.lesson != null) "$count preguntas · hasta ${count * 10 + 10} XP" +
                            (if (done) "\nYa la completaste: repetirla refuerza tu memoria." else "")
                        else "12 preguntas mezcladas de toda la unidad. Mezclar temas te obliga a recordar de verdad: así se fija mejor."
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { vm.startNode(n); pending = null }) {
                    Text(if (done) "PRACTICAR DE NUEVO" else "COMENZAR", fontWeight = FontWeight.ExtraBold, color = GoGreen)
                }
            },
            dismissButton = { TextButton(onClick = { pending = null }) { Text("Ahora no") } },
        )
    }
    if (lockedMsg) {
        AlertDialog(
            onDismissRequest = { lockedMsg = false },
            title = { Text("🔒 Aún bloqueada") },
            text = { Text("Completa la lección anterior para desbloquearla. Si ya sabes el tema, en Perfil puedes desbloquear toda la ruta.") },
            confirmButton = { TextButton(onClick = { lockedMsg = false }) { Text("Entendido") } },
        )
    }
}

@Composable
private fun Greeting(vm: AppViewModel) {
    val p = vm.progress
    val today = p.todayXp()
    val name = p.name.ifBlank { "conductor/a" }
    val msg = when {
        p.completed.isEmpty() -> "¡Hola, $name! Empecemos por la primera lección. Son solo unos minutos."
        today >= p.dailyGoal -> "¡Meta cumplida hoy! Si quieres más, repasa lo que tienes pendiente."
        vm.dueCount() >= 5 -> "Tienes ${vm.dueCount()} preguntas listas para repasar. Repasar ahora evita que las olvides."
        else -> "Hoy llevas $today de ${p.dailyGoal} XP. ¡Sigamos avanzando!"
    }
    OutlinedPanel(Modifier.fillMaxWidth().padding(16.dp)) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Mascot(if (today >= p.dailyGoal) Mood.CHEER else Mood.HAPPY, size = 64.dp)
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(msg, style = MaterialTheme.typography.bodyMedium)
                Spacer(Modifier.height(8.dp))
                ProgressPill(today.toFloat() / p.dailyGoal, GoGreen, Modifier.fillMaxWidth(), height = 12.dp)
            }
        }
    }
}

@Composable
private fun UnitHeader(unit: StudyUnit, index: Int, mastery: Float, onGuide: () -> Unit) {
    val c = Color(AppViewModel.parseColor(unit.color))
    Box(
        Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp)
            .clip(RoundedCornerShape(18.dp)).background(c.darker())
            .padding(bottom = 4.dp).clip(RoundedCornerShape(18.dp)).background(c)
    ) {
        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text("UNIDAD ${index + 1} · ${unit.chapter.uppercase()}", color = Color.White.copy(alpha = 0.85f), fontSize = 12.sp, fontWeight = FontWeight.ExtraBold)
                Text(unit.title, color = Color.White, style = MaterialTheme.typography.titleLarge)
                Text(unit.subtitle, color = Color.White.copy(alpha = 0.9f), fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.width(120.dp).height(8.dp).clip(RoundedCornerShape(50)).background(Color.White.copy(alpha = 0.3f))) {
                        Box(Modifier.fillMaxWidth(mastery.coerceIn(0f, 1f)).height(8.dp).clip(RoundedCornerShape(50)).background(Color.White))
                    }
                    Spacer(Modifier.width(8.dp))
                    Text("Memoria ${(mastery * 100).toInt()}%", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
            Box(
                Modifier.clip(RoundedCornerShape(14.dp)).border(2.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .clickable(onClick = onGuide).padding(horizontal = 12.dp, vertical = 10.dp),
                contentAlignment = Alignment.Center,
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("📘", fontSize = 22.sp)
                    Text("GUÍA", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
                }
            }
        }
    }
}

private val zigzag = listOf(0, 55, 85, 55, 0, -55, -85, -55)

@Composable
private fun NodeRow(n: PathNode, globalIndex: Int, done: Boolean, unlocked: Boolean, current: Boolean, onClick: () -> Unit) {
    val extra = LocalExtra.current
    val unitColor = Color(AppViewModel.parseColor(n.unit.color))
    val isTest = n.lesson == null
    val color = when {
        done && isTest -> Gold
        done -> unitColor
        unlocked -> unitColor
        else -> extra.locked
    }
    val shadow = if (unlocked || done) color.darker() else extra.lockedDark
    val pulse by rememberInfiniteTransition(label = "pulse").animateFloat(
        1f, 1.08f, infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "s",
    )
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()

    Column(
        Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Column(Modifier.offset(x = zigzag[globalIndex % zigzag.size].dp), horizontalAlignment = Alignment.CenterHorizontally) {
            if (current) {
                Box(
                    Modifier.clip(RoundedCornerShape(10.dp)).background(MaterialTheme.colorScheme.surface)
                        .border(2.dp, extra.outline, RoundedCornerShape(10.dp)).padding(horizontal = 12.dp, vertical = 6.dp)
                ) { Text("EMPEZAR", color = unitColor, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp) }
                Spacer(Modifier.height(6.dp))
            }
            val size = if (isTest) 80.dp else 72.dp
            Box(
                Modifier.size(size, size + 6.dp).scale(if (current) pulse else 1f)
                    .clickable(interactionSource = interaction, indication = null, onClick = onClick)
            ) {
                Box(Modifier.size(size).offset(y = 6.dp).clip(CircleShape).background(shadow))
                Box(
                    Modifier.size(size).offset(y = if (pressed) 6.dp else 0.dp).clip(CircleShape).background(color),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        when {
                            !unlocked -> "🔒"
                            isTest -> "🏆"
                            done -> "✓"
                            else -> "★"
                        },
                        fontSize = if (done && !isTest) 32.sp else 30.sp,
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                    )
                }
            }
            Spacer(Modifier.height(6.dp))
            Text(
                n.title,
                modifier = Modifier.width(150.dp),
                textAlign = TextAlign.Center,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (unlocked) MaterialTheme.colorScheme.onBackground else MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun FinishLine(vm: AppViewModel) {
    OutlinedPanel(Modifier.fillMaxWidth().padding(16.dp)) {
        Column(Modifier.padding(18.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("🏁", fontSize = 40.sp)
            Text("Meta final: el examen teórico", style = MaterialTheme.typography.titleMedium)
            Text(
                "Cuando termines la ruta, practica con simulacros hasta aprobar varias veces seguidas.",
                textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            ChunkyButton("Ir al simulacro", Modifier.fillMaxWidth(), color = MaterialTheme.colorScheme.tertiary) {
                vm.tab = com.appdaniel.rutab.Tab.EXAM
            }
        }
    }
}
