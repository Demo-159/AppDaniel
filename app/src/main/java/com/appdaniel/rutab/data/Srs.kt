package com.appdaniel.rutab.data

/**
 * Repetición espaciada con cajas de Leitner.
 * Cada acierto sube la pregunta de caja y la aleja en el tiempo; un error la devuelve a la caja 0
 * para repasarla hoy mismo. Así repasas justo antes de olvidar (efecto de espaciado).
 */
object Srs {
    /** Días de espera según la caja: 0, 1, 3, 7, 14 y 30 días. */
    val intervals = intArrayOf(0, 1, 3, 7, 14, 30)
    const val MAX_BOX = 5

    fun update(card: Card?, correct: Boolean, today: Long): Card {
        val c = card ?: Card()
        return if (correct) {
            val box = (c.box + 1).coerceAtMost(MAX_BOX)
            c.copy(box = box, due = today + intervals[box], seen = c.seen + 1, right = c.right + 1)
        } else {
            c.copy(box = 0, due = today, seen = c.seen + 1, wrong = c.wrong + 1)
        }
    }

    /** Dominio de 0 a 1 para un conjunto de preguntas (las no vistas cuentan como 0). */
    fun mastery(cards: Map<String, Card>, ids: List<String>): Float {
        if (ids.isEmpty()) return 0f
        return ids.sumOf { (cards[it]?.box ?: 0).toDouble() }.toFloat() / (ids.size * MAX_BOX)
    }
}
