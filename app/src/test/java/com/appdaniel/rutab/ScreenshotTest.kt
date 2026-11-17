package com.appdaniel.rutab

import androidx.activity.compose.LocalActivityResultRegistryOwner
import androidx.activity.result.ActivityResultRegistry
import androidx.activity.result.ActivityResultRegistryOwner
import androidx.activity.result.contract.ActivityResultContract
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.core.app.ActivityOptionsCompat
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.appdaniel.rutab.data.Card
import com.appdaniel.rutab.data.ExamResult
import com.appdaniel.rutab.data.Progress
import com.appdaniel.rutab.data.today
import com.appdaniel.rutab.ui.screens.GuideScreen
import com.appdaniel.rutab.ui.screens.HomeScreen
import com.appdaniel.rutab.ui.screens.LessonScreen
import com.appdaniel.rutab.ui.screens.OnboardingScreen
import com.appdaniel.rutab.ui.screens.ResultScreen
import com.appdaniel.rutab.ui.theme.RutaBTheme
import org.junit.Rule
import org.junit.Test

/** Capturas de las pantallas reales, renderizadas con layoutlib (sin emulador). */
class ScreenshotTest {
    @get:Rule
    val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5, theme = "android:Theme.Material.Light.NoActionBar", maxPercentDifference = 0.1)

    private val t = today()
    private fun midProgress(): Progress {
        val c = TestSupport.content
        val done = setOf("u1:0", "u1:1", "u1:test", "u2:0")
        val cards = c.questions.filter { it.unit == "u1" || (it.unit == "u2" && it.lesson == 0) }
            .associate { it.id to Card(box = if (it.id.hashCode() % 3 == 0) 1 else 3, due = if (it.id.hashCode() % 4 == 0) t else t + 3, seen = 2, right = 1, wrong = if (it.id.hashCode() % 5 == 0) 2 else 0) }
        return Progress(
            onboarded = true, name = "Camila", xp = 640, dailyGoal = 50, streak = 6, bestStreak = 6, lastStudyDay = t,
            xpByDay = mapOf(t - 6 to 60, t - 5 to 90, t - 4 to 20, t - 3 to 120, t - 2 to 55, t - 1 to 70, t to 30),
            completed = done, cards = cards, achievements = setOf("first", "streak3", "perfect", "xp500", "unit"),
            totalAnswered = 80, totalCorrect = 66,
            exams = listOf(ExamResult(t - 2, 29, 38, 28, 35, false), ExamResult(t - 1, 34, 38, 33, 35, true)),
        )
    }

    private val fakeRegistry = object : ActivityResultRegistryOwner {
        override val activityResultRegistry = object : ActivityResultRegistry() {
            override fun <I, O> onLaunch(requestCode: Int, contract: ActivityResultContract<I, O>, input: I, options: ActivityOptionsCompat?) {}
        }
    }

    private fun shot(name: String, content: @Composable () -> Unit) =
        paparazzi.snapshot(name) {
            CompositionLocalProvider(LocalActivityResultRegistryOwner provides fakeRegistry) { RutaBTheme { content() } }
        }

    @Test fun onboarding() { val vm = TestSupport.vm(Progress()); shot("01_onboarding") { OnboardingScreen(vm) } }

    @Test fun pathFresh() { val vm = TestSupport.vm(); shot("02_ruta_inicio") { HomeScreen(vm) } }

    @Test fun pathProgress() { val vm = TestSupport.vm(midProgress()); shot("03_ruta_avance") { HomeScreen(vm) } }

    private fun lessonWith(id: String, block: (AppViewModel) -> Unit = {}): AppViewModel {
        val vm = TestSupport.vm(midProgress())
        val q = TestSupport.content.questions.first { it.id == id }
        val node = vm.nodes.first { it.unit.id == q.unit && it.lesson == q.lesson }
        vm.startNode(node)
        // avanza hasta que aparezca la pregunta deseada (respondiendo bien las anteriores)
        while (vm.session!!.current!!.id != id) { vm.submit(true); vm.next() }
        block(vm)
        return vm
    }

    @Test fun lessonChoice() { val vm = lessonWith("u8-01"); shot("04_leccion_opcion") { LessonScreen(vm) } }
    @Test fun lessonWrong() { val vm = lessonWith("u8-01") { it.submit(false) }; shot("05_leccion_error") { LessonScreen(vm) } }
    @Test fun lessonRight() { val vm = lessonWith("u8-03") { it.submit(true) }; shot("06_leccion_acierto") { LessonScreen(vm) } }
    @Test fun lessonSignPare() { val vm = lessonWith("u7-14"); shot("07_senal_pare") { LessonScreen(vm) } }
    @Test fun lessonSignLight() { val vm = lessonWith("u7-08"); shot("08_senal_semaforo") { LessonScreen(vm) } }
    @Test fun lessonSignCurve() { val vm = lessonWith("u7-13"); shot("09_senal_curva") { LessonScreen(vm) } }
    @Test fun lessonSignSanAndres() { val vm = lessonWith("u7-21"); shot("10_senal_cruz") { LessonScreen(vm) } }
    @Test fun lessonSignCeda() { val vm = lessonWith("u7-15"); shot("11_senal_ceda") { LessonScreen(vm) } }
    @Test fun lessonMatch() { val vm = lessonWith("u11-09"); shot("12_unir_parejas") { LessonScreen(vm) } }
    @Test fun lessonOrder() { val vm = lessonWith("u11-10"); shot("13_ordenar") { LessonScreen(vm) } }
    @Test fun lessonImage() { val vm = lessonWith("u7-s104"); shot("15_imagen_senal") { LessonScreen(vm) } }
    @Test fun lessonTf() { val vm = lessonWith("u5-08"); shot("14_verdadero_falso") { LessonScreen(vm) } }

    @Test fun result() {
        val vm = TestSupport.vm(Progress(onboarded = true, streak = 2, bestStreak = 2, lastStudyDay = t - 1))
        vm.startNode(vm.nodes.first())
        repeat(vm.session!!.total) { vm.submit(true); vm.next() }
        shot("15_resultado") { ResultScreen(vm) }
    }

    @Test fun examResult() {
        val vm = TestSupport.vm(midProgress())
        vm.startExam()
        var n = 0
        while (vm.session != null) vm.submit(n++ % 9 != 0)
        shot("16_resultado_simulacro") { ResultScreen(vm) }
    }

    @Test fun review() { val vm = TestSupport.vm(midProgress()).apply { tab = Tab.REVIEW }; shot("17_repaso") { HomeScreen(vm) } }
    @Test fun exam() { val vm = TestSupport.vm(midProgress()).apply { tab = Tab.EXAM }; shot("18_simulacro") { HomeScreen(vm) } }
    @Test fun profile() { val vm = TestSupport.vm(midProgress()).apply { tab = Tab.PROFILE }; shot("19_perfil") { HomeScreen(vm) } }
    @Test fun guide() { val vm = TestSupport.vm(midProgress()); shot("20_guia") { GuideScreen(vm, vm.unitById("u8")) } }
}
