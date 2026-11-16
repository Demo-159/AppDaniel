package com.appdaniel.rutab.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val RoadYellow = Color(0xFFFFC93C)
val GoGreen = Color(0xFF2FA35B)
val GoGreenDark = Color(0xFF1E7A41)
val StopRed = Color(0xFFE5484D)
val StopRedDark = Color(0xFFB4262B)
val InfoBlue = Color(0xFF2F80ED)
val InfoBlueDark = Color(0xFF1B5FBF)
val ConeOrange = Color(0xFFFF8A3D)
val Asphalt = Color(0xFF263238)
val Gold = Color(0xFFF5B800)
val Purple = Color(0xFF7048E8)

@Immutable
data class Extra(
    val correctBg: Color,
    val correctFg: Color,
    val wrongBg: Color,
    val wrongFg: Color,
    val locked: Color,
    val lockedDark: Color,
    val outline: Color,
    val selectedBg: Color,
)

private val LightExtra = Extra(
    correctBg = Color(0xFFD7F5E1), correctFg = Color(0xFF1E7A41),
    wrongBg = Color(0xFFFFE1E1), wrongFg = Color(0xFFB4262B),
    locked = Color(0xFFE2E5E9), lockedDark = Color(0xFFC3C8CF),
    outline = Color(0xFFDCE0E5), selectedBg = Color(0xFFE3EEFF),
)
private val DarkExtra = Extra(
    correctBg = Color(0xFF16381F), correctFg = Color(0xFF7BE0A0),
    wrongBg = Color(0xFF431D1F), wrongFg = Color(0xFFFF9A9A),
    locked = Color(0xFF2C3339), lockedDark = Color(0xFF1E2328),
    outline = Color(0xFF3A434B), selectedBg = Color(0xFF1C3150),
)

val LocalExtra = staticCompositionLocalOf { LightExtra }

private val LightColors = lightColorScheme(
    primary = GoGreen, onPrimary = Color.White,
    secondary = RoadYellow, onSecondary = Asphalt,
    tertiary = InfoBlue, onTertiary = Color.White,
    background = Color(0xFFF6F7F3), onBackground = Color(0xFF1B1F23),
    surface = Color.White, onSurface = Color(0xFF1B1F23),
    surfaceVariant = Color(0xFFEEF0EC), onSurfaceVariant = Color(0xFF5B6570),
    error = StopRed,
)
private val DarkColors = darkColorScheme(
    primary = Color(0xFF45C077), onPrimary = Color(0xFF00210E),
    secondary = RoadYellow, onSecondary = Asphalt,
    tertiary = Color(0xFF6FA8FF), onTertiary = Color(0xFF00214A),
    background = Color(0xFF111518), onBackground = Color(0xFFE6E9EC),
    surface = Color(0xFF1A2025), onSurface = Color(0xFFE6E9EC),
    surfaceVariant = Color(0xFF232A30), onSurfaceVariant = Color(0xFFA6B0BA),
    error = Color(0xFFFF6B6B),
)

private val AppTypography = Typography(
    headlineMedium = TextStyle(fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, lineHeight = 32.sp),
    titleLarge = TextStyle(fontSize = 21.sp, fontWeight = FontWeight.Bold, lineHeight = 28.sp),
    titleMedium = TextStyle(fontSize = 17.sp, fontWeight = FontWeight.Bold, lineHeight = 23.sp),
    bodyLarge = TextStyle(fontSize = 17.sp, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontSize = 15.sp, lineHeight = 21.sp),
    labelLarge = TextStyle(fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 0.8.sp),
)

@Composable
fun RutaBTheme(content: @Composable () -> Unit) {
    val dark = isSystemInDarkTheme()
    androidx.compose.runtime.CompositionLocalProvider(LocalExtra provides if (dark) DarkExtra else LightExtra) {
        MaterialTheme(colorScheme = if (dark) DarkColors else LightColors, typography = AppTypography, content = content)
    }
}

/** Oscurece un color para el "borde inferior" de los botones con relieve. */
fun Color.darker(f: Float = 0.78f) = Color(red * f, green * f, blue * f, alpha)
