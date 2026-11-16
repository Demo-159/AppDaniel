package com.appdaniel.rutab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.AppViewModel
import com.appdaniel.rutab.Tab
import com.appdaniel.rutab.ui.components.StatChip
import com.appdaniel.rutab.ui.components.Weight1
import com.appdaniel.rutab.ui.theme.ConeOrange
import com.appdaniel.rutab.ui.theme.GoGreen
import com.appdaniel.rutab.ui.theme.Gold
import com.appdaniel.rutab.ui.theme.LocalExtra

@Composable
fun HomeScreen(vm: AppViewModel) {
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = { StatsBar(vm) },
        bottomBar = {
            Column {
                HorizontalDivider(color = LocalExtra.current.outline, thickness = 2.dp)
                NavigationBar(containerColor = MaterialTheme.colorScheme.surface, tonalElevation = 0.dp) {
                    val dueBadge = vm.dueCount()
                    listOf(
                        Triple(Tab.PATH, "Ruta", Icons.Filled.Home),
                        Triple(Tab.REVIEW, if (dueBadge > 0) "Repaso ($dueBadge)" else "Repaso", Icons.Filled.Refresh),
                        Triple(Tab.EXAM, "Simulacro", Icons.Filled.Create),
                        Triple(Tab.PROFILE, "Perfil", Icons.Filled.Person),
                    ).forEach { (tab, label, icon) ->
                        NavigationBarItem(
                            selected = vm.tab == tab,
                            onClick = { vm.tab = tab },
                            icon = { Icon(icon, contentDescription = label) },
                            label = { Text(label, fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MaterialTheme.colorScheme.tertiary,
                                selectedTextColor = MaterialTheme.colorScheme.tertiary,
                                indicatorColor = LocalExtra.current.selectedBg,
                            ),
                        )
                    }
                }
            }
        },
    ) { pad ->
        Box(Modifier.fillMaxSize().padding(pad)) {
            when (vm.tab) {
                Tab.PATH -> PathScreen(vm)
                Tab.REVIEW -> ReviewScreen(vm)
                Tab.EXAM -> ExamScreen(vm)
                Tab.PROFILE -> ProfileScreen(vm)
            }
        }
    }
}

@Composable
private fun StatsBar(vm: AppViewModel) {
    val p = vm.progress
    val streak = p.currentStreak()
    val today = p.todayXp()
    Column(Modifier.background(MaterialTheme.colorScheme.surface).statusBarsPadding()) {
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 18.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Ruta B", style = MaterialTheme.typography.titleLarge, color = GoGreen, fontWeight = FontWeight.Black)
            Weight1()
            StatChip(if (streak > 0) "🔥" else "🩶", "$streak", if (streak > 0) ConeOrange else MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.width(16.dp))
            StatChip("⚡", "${p.xp}", Gold)
            Spacer(Modifier.width(16.dp))
            Box(contentAlignment = Alignment.Center) {
                CircularProgressIndicator(
                    progress = { (today.toFloat() / p.dailyGoal).coerceIn(0f, 1f) },
                    modifier = Modifier.size(34.dp),
                    color = GoGreen,
                    trackColor = LocalExtra.current.locked,
                    strokeWidth = 4.dp,
                    strokeCap = StrokeCap.Round,
                )
                Text(if (today >= p.dailyGoal) "✓" else "🎯", fontSize = 13.sp, color = GoGreen, fontWeight = FontWeight.Black)
            }
        }
        HorizontalDivider(color = LocalExtra.current.outline, thickness = 2.dp)
        Spacer(Modifier.height(0.dp))
    }
}
