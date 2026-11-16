package com.appdaniel.rutab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import com.appdaniel.rutab.notify.Reminder
import com.appdaniel.rutab.ui.screens.GuideScreen
import com.appdaniel.rutab.ui.screens.HomeScreen
import com.appdaniel.rutab.ui.screens.LessonScreen
import com.appdaniel.rutab.ui.screens.OnboardingScreen
import com.appdaniel.rutab.ui.screens.ResultScreen
import com.appdaniel.rutab.ui.theme.RutaBTheme

class MainActivity : ComponentActivity() {
    private val vm: AppViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        Reminder.ensureChannel(this)
        if (vm.progress.reminder) Reminder.schedule(this, vm.progress.reminderHour)
        setContent {
            RutaBTheme {
                Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
                    AnimatedContent(
                        targetState = vm.screen,
                        transitionSpec = { fadeIn() togetherWith fadeOut() },
                        contentKey = { it::class },
                        label = "screen",
                    ) { screen ->
                        when (screen) {
                            Screen.Onboarding -> OnboardingScreen(vm)
                            Screen.Home -> HomeScreen(vm)
                            Screen.Study -> LessonScreen(vm)
                            Screen.Result -> ResultScreen(vm)
                            is Screen.Guide -> GuideScreen(vm, vm.unitById(screen.unitId))
                        }
                    }
                }
            }
        }
    }
}
