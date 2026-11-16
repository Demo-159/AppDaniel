package com.appdaniel.rutab

import android.app.Application
import android.content.Context
import com.appdaniel.rutab.data.Content
import com.appdaniel.rutab.data.InMemoryStorage
import com.appdaniel.rutab.data.Progress
import kotlinx.serialization.json.Json
import java.io.File

object TestSupport {
    val content: Content by lazy {
        val f = listOf("src/main/assets/content.json", "app/src/main/assets/content.json").map(::File).first { it.exists() }
        Json { ignoreUnknownKeys = true }.decodeFromString(f.readText())
    }

    class TestApp(base: Context?) : Application() {
        init { if (base != null) attachBaseContext(base) }
    }

    fun vm(progress: Progress = Progress(onboarded = true), base: Context? = null): AppViewModel =
        AppViewModel(TestApp(base), content, InMemoryStorage(progress))
}
