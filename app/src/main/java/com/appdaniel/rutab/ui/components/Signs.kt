package com.appdaniel.rutab.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.sin

private val SignRed = Color(0xFFD62828)
private val SignYellow = Color(0xFFFFCC00)
private val SignOrange = Color(0xFFFF7A00)
private val SignBlack = Color(0xFF1A1A1A)

/** Señales de tránsito y semáforos dibujados vectorialmente (ilustrativos). */
@Composable
fun SignView(key: String, size: Dp = 150.dp, modifier: Modifier = Modifier) {
    val tm = rememberTextMeasurer()
    val blink by rememberInfiniteTransition(label = "blink").animateFloat(
        1f, 0.15f, infiniteRepeatable(tween(550), RepeatMode.Reverse), label = "b",
    )
    Canvas(modifier.size(if (key.startsWith("sem_")) size * 0.62f else size, size)) {
        when (key) {
            "pare" -> pare(tm)
            "ceda" -> ceda(tm)
            "vel50" -> roundSign { label(tm, "50", 0.36f, SignBlack) }
            "no_estacionar" -> noEstacionar(tm)
            "curva" -> rhombus(SignYellow) { curveArrow() }
            "trabajos" -> rhombus(SignOrange) { worker() }
            "cruz_san_andres" -> sanAndres()
            "sem_rojo" -> trafficLight(red = 1f)
            "sem_rojo_int" -> trafficLight(red = blink)
            "sem_amarillo" -> trafficLight(yellow = 1f)
            "sem_verde" -> trafficLight(green = 1f)
            "sem_flecha" -> trafficLight(red = 1f, arrow = true)
        }
    }
}

private fun DrawScope.label(tm: TextMeasurer, text: String, rel: Float, color: Color, y: Float = 0.5f) {
    val style = TextStyle(color = color, fontSize = (size.minDimension * rel / density).sp / fontScale, fontWeight = FontWeight.Black, textAlign = TextAlign.Center)
    val layout = tm.measure(text, style)
    drawText(layout, topLeft = Offset(size.width / 2 - layout.size.width / 2, size.height * y - layout.size.height / 2))
}

private fun DrawScope.pare(tm: TextMeasurer) {
    val c = center
    val r = size.minDimension / 2
    fun oct(rad: Float) = Path().apply {
        for (i in 0 until 8) {
            val a = Math.toRadians(22.5 + 45.0 * i)
            val p = Offset(c.x + rad * cos(a).toFloat(), c.y + rad * sin(a).toFloat())
            if (i == 0) moveTo(p.x, p.y) else lineTo(p.x, p.y)
        }
        close()
    }
    drawPath(oct(r), Color.White)
    drawPath(oct(r * 0.9f), SignRed)
    label(tm, "PARE", 0.27f, Color.White)
}

private fun DrawScope.ceda(tm: TextMeasurer) {
    val w = size.width; val h = size.height
    val outer = Path().apply { moveTo(w * 0.02f, h * 0.1f); lineTo(w * 0.98f, h * 0.1f); lineTo(w * 0.5f, h * 0.93f); close() }
    val inner = Path().apply { moveTo(w * 0.2f, h * 0.2f); lineTo(w * 0.8f, h * 0.2f); lineTo(w * 0.5f, h * 0.72f); close() }
    drawPath(outer, SignRed)
    drawPath(inner, Color.White)
    label(tm, "CEDA EL\nPASO", 0.085f, SignBlack, y = 0.36f)
}

private fun DrawScope.roundSign(content: DrawScope.() -> Unit) {
    val r = size.minDimension / 2
    drawCircle(Color.White, r)
    drawCircle(SignRed, r * 0.84f, style = Stroke(width = r * 0.22f))
    content()
}

private fun DrawScope.noEstacionar(tm: TextMeasurer) {
    val r = size.minDimension / 2
    drawCircle(Color.White, r)
    drawCircle(SignRed, r * 0.84f, style = Stroke(width = r * 0.2f))
    label(tm, "E", 0.5f, SignBlack)
    val d = r * 0.6f
    drawLine(SignRed, Offset(center.x - d, center.y - d), Offset(center.x + d, center.y + d), strokeWidth = r * 0.18f)
}

private fun DrawScope.rhombus(fill: Color, content: DrawScope.() -> Unit) {
    val w = size.width; val h = size.height
    fun shape(inset: Float) = Path().apply {
        moveTo(w / 2, inset); lineTo(w - inset, h / 2); lineTo(w / 2, h - inset); lineTo(inset, h / 2); close()
    }
    drawPath(shape(2f), SignBlack)
    drawPath(shape(w * 0.045f), fill)
    drawPath(shape(w * 0.075f), SignBlack, style = Stroke(width = w * 0.012f))
    content()
}

private fun DrawScope.curveArrow() {
    val w = size.width; val h = size.height
    val p = Path().apply {
        moveTo(w * 0.43f, h * 0.72f)
        lineTo(w * 0.43f, h * 0.5f)
        quadraticTo(w * 0.43f, h * 0.38f, w * 0.56f, h * 0.36f)
    }
    drawPath(p, SignBlack, style = Stroke(width = w * 0.075f, cap = StrokeCap.Butt))
    drawPath(Path().apply { moveTo(w * 0.53f, h * 0.27f); lineTo(w * 0.66f, h * 0.36f); lineTo(w * 0.53f, h * 0.45f); close() }, SignBlack)
}

private fun DrawScope.worker() {
    val w = size.width; val h = size.height
    drawCircle(SignBlack, w * 0.055f, Offset(w * 0.47f, h * 0.33f))
    drawLine(SignBlack, Offset(w * 0.47f, h * 0.4f), Offset(w * 0.5f, h * 0.56f), strokeWidth = w * 0.07f, cap = StrokeCap.Round)
    drawLine(SignBlack, Offset(w * 0.5f, h * 0.56f), Offset(w * 0.42f, h * 0.7f), strokeWidth = w * 0.05f, cap = StrokeCap.Round)
    drawLine(SignBlack, Offset(w * 0.5f, h * 0.56f), Offset(w * 0.56f, h * 0.7f), strokeWidth = w * 0.05f, cap = StrokeCap.Round)
    drawLine(SignBlack, Offset(w * 0.48f, h * 0.44f), Offset(w * 0.62f, h * 0.52f), strokeWidth = w * 0.04f, cap = StrokeCap.Round)
    drawLine(SignBlack, Offset(w * 0.62f, h * 0.44f), Offset(w * 0.62f, h * 0.66f), strokeWidth = w * 0.03f, cap = StrokeCap.Round)
    drawRect(SignBlack, topLeft = Offset(w * 0.3f, h * 0.66f), size = Size(w * 0.12f, h * 0.05f))
}

private fun DrawScope.sanAndres() {
    val w = size.width
    val len = w * 1.02f
    val th = w * 0.2f
    for (angle in listOf(45f, -45f)) {
        rotate(angle) {
            drawRoundRect(SignRed, topLeft = Offset(center.x - len / 2, center.y - th / 2), size = Size(len, th), cornerRadius = CornerRadius(4f))
            drawRect(Color.White, topLeft = Offset(center.x - len / 2 + th * 0.18f, center.y - th / 2 + th * 0.18f), size = Size(len - th * 0.36f, th * 0.64f))
        }
    }
    drawCircle(SignRed, w * 0.025f, center)
}

private fun DrawScope.trafficLight(red: Float = 0f, yellow: Float = 0f, green: Float = 0f, arrow: Boolean = false) {
    val w = size.width; val h = size.height
    drawRoundRect(SignBlack, topLeft = Offset(w * 0.08f, 0f), size = Size(w * 0.84f, h), cornerRadius = CornerRadius(w * 0.2f))
    val r = w * 0.27f
    val ys = listOf(h * 0.18f, h * 0.5f, h * 0.82f)
    val dim = 0.16f
    drawCircle(Color(0xFFFF3B30).copy(alpha = maxOf(dim, red)), r, Offset(w / 2, ys[0]))
    drawCircle(Color(0xFFFFC400).copy(alpha = maxOf(dim, yellow)), r, Offset(w / 2, ys[1]))
    if (arrow) {
        drawCircle(Color(0xFF13161A), r, Offset(w / 2, ys[2]))
        val g = Color(0xFF2EE66B)
        drawLine(g, Offset(w * 0.32f, ys[2]), Offset(w * 0.64f, ys[2]), strokeWidth = r * 0.28f, cap = StrokeCap.Round)
        drawPath(Path().apply {
            moveTo(w * 0.72f, ys[2]); lineTo(w * 0.56f, ys[2] - r * 0.45f); lineTo(w * 0.56f, ys[2] + r * 0.45f); close()
        }, g)
    } else {
        drawCircle(Color(0xFF2EE66B).copy(alpha = maxOf(dim, green)), r, Offset(w / 2, ys[2]))
    }
    // visera de brillo
    listOf(red, yellow, if (arrow) 0f else green).forEachIndexed { i, on ->
        if (on > 0.5f) drawCircle(Color.White.copy(alpha = 0.25f * on), r * 0.35f, Offset(w / 2 - r * 0.35f, ys[i] - r * 0.35f))
    }
}
