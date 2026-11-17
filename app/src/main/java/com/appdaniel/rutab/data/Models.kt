package com.appdaniel.rutab.data

import android.content.Context
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** Contenido de estudio, cargado desde assets/content.json (basado en el Libro de CONASET). */
@Serializable
data class Content(val units: List<StudyUnit>, val questions: List<Question>)

@Serializable
data class StudyUnit(
    val id: String,
    val title: String,
    val subtitle: String,
    val icon: String,
    val color: String,
    val chapter: String,
    val lessons: List<String>,
    val guide: List<String>,
    /** Una cápsula de video por lección: escenas con visual, titular y narración. */
    val capsules: List<List<Scene>> = emptyList(),
)

/**
 * Escena de una cápsula. [v] es el visual: un emoji, "sign:<clave>" para una señal dibujada,
 * o "num:<cifra>|<unidad>" para una cifra grande.
 */
@Serializable
data class Scene(val v: String, val h: String, val t: String)

/**
 * Tipos:
 *  - mc / sign: opción múltiple; en el JSON la PRIMERA opción es la correcta (se baraja al mostrar).
 *  - tf: verdadero/falso, usa [answer].
 *  - order: ordenar [items] (vienen en el orden correcto).
 *  - match: unir parejas [pairs].
 *  - img: opción múltiple con una imagen del libro en [image] (ruta dentro de assets).
 */
@Serializable
data class Question(
    val id: String,
    val unit: String,
    val lesson: Int,
    val type: String,
    val prompt: String,
    val options: List<String> = emptyList(),
    val answer: Boolean? = null,
    val items: List<String> = emptyList(),
    val pairs: List<List<String>> = emptyList(),
    val explain: String,
    val page: Int,
    val sign: String? = null,
    /** Imagen tomada del libro (p. ej. "img/senales/s000.webp"), dentro de assets. */
    val image: String? = null,
) {
    val isChoice get() = type == "mc" || type == "sign" || type == "img"

    fun correctAnswerText(): String = when (type) {
        "tf" -> if (answer == true) "Verdadero" else "Falso"
        "order" -> items.joinToString("  →  ")
        "match" -> pairs.joinToString("\n") { "${it[0]} = ${it[1]}" }
        else -> options.firstOrNull().orEmpty()
    }
}

object ContentRepo {
    private val json = Json { ignoreUnknownKeys = true }
    fun load(ctx: Context): Content =
        ctx.assets.open("content.json").bufferedReader().use { json.decodeFromString(it.readText()) }
}
