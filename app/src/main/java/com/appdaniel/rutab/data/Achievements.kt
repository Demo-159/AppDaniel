package com.appdaniel.rutab.data

data class Achievement(val id: String, val icon: String, val title: String, val desc: String)

object Achievements {
    val all = listOf(
        Achievement("first", "🔑", "Contacto", "Completa tu primera lección"),
        Achievement("streak3", "🔥", "Motor encendido", "Racha de 3 días"),
        Achievement("streak7", "🗓️", "Semana en ruta", "Racha de 7 días"),
        Achievement("streak30", "🏅", "Conductor constante", "Racha de 30 días"),
        Achievement("perfect", "✨", "Sin multas", "Termina una lección sin errores"),
        Achievement("perfect5", "📋", "Hoja de vida limpia", "5 lecciones perfectas"),
        Achievement("xp500", "🛣️", "500 km recorridos", "Gana 500 XP"),
        Achievement("xp2000", "🚀", "Gran viajero", "Gana 2.000 XP"),
        Achievement("capsule5", "🎬", "Maratón vial", "Mira 5 cápsulas de video"),
        Achievement("unit", "🏁", "Primera meta", "Completa todas las lecciones de una unidad"),
        Achievement("allunits", "🪪", "Licencia en mano", "Completa todas las unidades"),
        Achievement("review25", "🧠", "Memoria de acero", "Responde 25 preguntas en repasos"),
        Achievement("master50", "🎓", "Experto en la materia", "Lleva 50 preguntas al nivel máximo de memoria"),
        Achievement("exam", "✅", "¡Aprobado!", "Aprueba un simulacro de examen"),
        Achievement("exam_perfect", "🏆", "Puntaje perfecto", "Saca el máximo en un simulacro"),
    )

    fun byId(id: String) = all.first { it.id == id }

    fun earned(p: Progress, content: Content): Set<String> {
        val s = mutableSetOf<String>()
        val unitDone = content.units.filter { u -> u.lessons.indices.all { "${u.id}:$it" in p.completed } }
        if (p.completed.isNotEmpty()) s += "first"
        if (p.watched.size >= 5) s += "capsule5"
        if (p.bestStreak >= 3) s += "streak3"
        if (p.bestStreak >= 7) s += "streak7"
        if (p.bestStreak >= 30) s += "streak30"
        if (p.perfectCount >= 1) s += "perfect"
        if (p.perfectCount >= 5) s += "perfect5"
        if (p.xp >= 500) s += "xp500"
        if (p.xp >= 2000) s += "xp2000"
        if (unitDone.isNotEmpty()) s += "unit"
        if (unitDone.size == content.units.size) s += "allunits"
        if (p.reviewAnswered >= 25) s += "review25"
        if (p.cards.values.count { it.box >= 4 } >= 50) s += "master50"
        if (p.exams.any { it.passed }) s += "exam"
        if (p.exams.any { it.points == it.max }) s += "exam_perfect"
        return s
    }
}
