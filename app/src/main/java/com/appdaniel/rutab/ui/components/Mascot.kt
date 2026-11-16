package com.appdaniel.rutab.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
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
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.appdaniel.rutab.ui.theme.Asphalt
import com.appdaniel.rutab.ui.theme.ConeOrange

enum class Mood { HAPPY, CHEER, SAD, NEUTRAL }

/** "Cono", la mascota de Ruta B: un cono de tránsito amistoso dibujado con Canvas. */
@Composable
fun Mascot(mood: Mood = Mood.HAPPY, size: Dp = 96.dp, modifier: Modifier = Modifier, animate: Boolean = true) {
    val t = rememberInfiniteTransition(label = "mascot")
    val bounce by t.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(if (mood == Mood.CHEER) 420 else 1400, easing = FastOutSlowInEasing), RepeatMode.Reverse),
        label = "bounce",
    )
    val b = if (animate) bounce else 0f
    Canvas(modifier.size(size)) {
        val w = this.size.width
        val h = this.size.height
        val lift = when (mood) { Mood.CHEER -> -h * 0.08f * b; Mood.SAD -> 0f; else -> -h * 0.025f * b }
        // sombra
        drawOval(Color.Black.copy(alpha = 0.12f), topLeft = Offset(w * 0.18f, h * 0.9f), size = Size(w * 0.64f, h * 0.08f))
        translate(top = lift) {
            // base
            drawRoundRect(Asphalt, topLeft = Offset(w * 0.12f, h * 0.78f), size = Size(w * 0.76f, h * 0.1f), cornerRadius = CornerRadius(w * 0.04f))
            // cuerpo
            val body = Path().apply {
                moveTo(w * 0.46f, h * 0.06f)
                quadraticTo(w * 0.5f, h * 0.02f, w * 0.54f, h * 0.06f)
                lineTo(w * 0.8f, h * 0.8f)
                lineTo(w * 0.2f, h * 0.8f)
                close()
            }
            drawPath(body, ConeOrange)
            // franjas reflectantes
            fun band(y1: Float, y2: Float) {
                val x1 = 0.5f - (0.04f + (y1 - 0.06f) * 0.405f)
                val x2 = 0.5f - (0.04f + (y2 - 0.06f) * 0.405f)
                drawPath(Path().apply {
                    moveTo(w * x1, h * y1); lineTo(w * (1 - x1), h * y1)
                    lineTo(w * (1 - x2), h * y2); lineTo(w * x2, h * y2); close()
                }, Color.White)
            }
            band(0.3f, 0.4f)
            band(0.56f, 0.66f)
            // brazos
            val arm = Stroke(width = w * 0.05f, cap = StrokeCap.Round)
            when (mood) {
                Mood.CHEER -> {
                    val wave = b * h * 0.04f
                    drawLine(ConeOrange, Offset(w * 0.3f, h * 0.5f), Offset(w * 0.12f, h * 0.28f - wave), strokeWidth = arm.width, cap = StrokeCap.Round)
                    drawLine(ConeOrange, Offset(w * 0.7f, h * 0.5f), Offset(w * 0.88f, h * 0.28f - wave), strokeWidth = arm.width, cap = StrokeCap.Round)
                }
                Mood.SAD -> {
                    drawLine(ConeOrange, Offset(w * 0.3f, h * 0.5f), Offset(w * 0.18f, h * 0.68f), strokeWidth = arm.width, cap = StrokeCap.Round)
                    drawLine(ConeOrange, Offset(w * 0.7f, h * 0.5f), Offset(w * 0.82f, h * 0.68f), strokeWidth = arm.width, cap = StrokeCap.Round)
                }
                else -> {
                    drawLine(ConeOrange, Offset(w * 0.3f, h * 0.5f), Offset(w * 0.14f, h * 0.56f), strokeWidth = arm.width, cap = StrokeCap.Round)
                    drawLine(ConeOrange, Offset(w * 0.7f, h * 0.5f), Offset(w * 0.86f, h * 0.44f - b * h * 0.03f), strokeWidth = arm.width, cap = StrokeCap.Round)
                }
            }
            // ojos
            val eyeY = h * 0.215f
            val er = w * 0.055f
            drawCircle(Color.White, er * 1.35f, Offset(w * 0.42f, eyeY))
            drawCircle(Color.White, er * 1.35f, Offset(w * 0.58f, eyeY))
            if (mood == Mood.CHEER) {
                val happyEye = Stroke(width = w * 0.03f, cap = StrokeCap.Round)
                drawArc(Asphalt, 200f, 140f, false, topLeft = Offset(w * 0.37f, eyeY - er * 0.4f), size = Size(w * 0.1f, w * 0.1f), style = happyEye)
                drawArc(Asphalt, 200f, 140f, false, topLeft = Offset(w * 0.53f, eyeY - er * 0.4f), size = Size(w * 0.1f, w * 0.1f), style = happyEye)
            } else {
                drawCircle(Asphalt, er * 0.75f, Offset(w * 0.425f, eyeY + er * 0.15f))
                drawCircle(Asphalt, er * 0.75f, Offset(w * 0.585f, eyeY + er * 0.15f))
                drawCircle(Color.White, er * 0.25f, Offset(w * 0.44f, eyeY - er * 0.1f))
                drawCircle(Color.White, er * 0.25f, Offset(w * 0.6f, eyeY - er * 0.1f))
            }
            // boca (sobre la franja blanca superior)
            val mouth = Stroke(width = w * 0.035f, cap = StrokeCap.Round)
            val my = h * 0.35f
            when (mood) {
                Mood.SAD -> drawArc(Asphalt, 200f, 140f, false, topLeft = Offset(w * 0.43f, my - h * 0.005f), size = Size(w * 0.14f, h * 0.08f), style = mouth)
                Mood.NEUTRAL -> drawLine(Asphalt, Offset(w * 0.45f, my), Offset(w * 0.55f, my), strokeWidth = mouth.width, cap = StrokeCap.Round)
                Mood.CHEER -> drawArc(Asphalt, 0f, 180f, true, topLeft = Offset(w * 0.42f, my - h * 0.04f), size = Size(w * 0.16f, h * 0.08f))
                Mood.HAPPY -> drawArc(Asphalt, 20f, 140f, false, topLeft = Offset(w * 0.43f, my - h * 0.05f), size = Size(w * 0.14f, h * 0.07f), style = mouth)
            }
            // mejillas
            drawCircle(Color(0xFFFF6B6B).copy(alpha = 0.45f), w * 0.03f, Offset(w * 0.36f, h * 0.29f))
            drawCircle(Color(0xFFFF6B6B).copy(alpha = 0.45f), w * 0.03f, Offset(w * 0.64f, h * 0.29f))
        }
    }
}
