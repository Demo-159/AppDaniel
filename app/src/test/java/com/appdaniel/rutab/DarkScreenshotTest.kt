package com.appdaniel.rutab

import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import com.android.resources.NightMode
import com.appdaniel.rutab.data.Progress
import com.appdaniel.rutab.data.today
import com.appdaniel.rutab.ui.screens.HomeScreen
import com.appdaniel.rutab.ui.screens.LessonScreen
import com.appdaniel.rutab.ui.theme.RutaBTheme
import org.junit.Rule
import org.junit.Test

class DarkScreenshotTest {
    @get:Rule
    val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5.copy(nightMode = NightMode.NIGHT), theme = "android:Theme.Material.NoActionBar")

    @Test fun pathDark() {
        val vm = TestSupport.vm(Progress(onboarded = true, xp = 120, streak = 2, lastStudyDay = today(), completed = setOf("u1:0")))
        paparazzi.snapshot("21_ruta_oscuro") { RutaBTheme { HomeScreen(vm) } }
    }

    @Test fun lessonDark() {
        val vm = TestSupport.vm()
        vm.startNode(vm.nodes.first { it.key == "u7:0" })
        while (vm.session!!.current!!.sign == null) { vm.submit(true); vm.next() }
        vm.submit(false)
        paparazzi.snapshot("22_leccion_oscuro") { RutaBTheme { LessonScreen(vm) } }
    }
}
