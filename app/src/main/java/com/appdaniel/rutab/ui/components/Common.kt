package com.appdaniel.rutab.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appdaniel.rutab.ui.theme.LocalExtra
import com.appdaniel.rutab.ui.theme.darker

/** Botón con relieve: se "hunde" al presionarlo. */
@Composable
fun ChunkyButton(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary,
    contentColor: Color = Color.White,
    enabled: Boolean = true,
    depth: Dp = 4.dp,
    onClick: () -> Unit,
) {
    val extra = LocalExtra.current
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val drop by animateDpAsState(if (pressed && enabled) depth else 0.dp, label = "press")
    val bg = if (enabled) color else extra.locked
    val shadow = if (enabled) color.darker() else extra.lockedDark
    val fg = if (enabled) contentColor else MaterialTheme.colorScheme.onSurfaceVariant
    Box(
        modifier
            .height(52.dp + depth)
            .clickable(interactionSource = interaction, indication = null, enabled = enabled, onClick = onClick)
    ) {
        Box(
            Modifier.fillMaxWidth().height(52.dp).offset(y = depth)
                .clip(RoundedCornerShape(16.dp)).background(shadow)
        )
        Box(
            Modifier.fillMaxWidth().height(52.dp).offset(y = drop)
                .clip(RoundedCornerShape(16.dp)).background(bg),
            contentAlignment = Alignment.Center,
        ) {
            Text(text.uppercase(), color = fg, style = MaterialTheme.typography.labelLarge)
        }
    }
}

/** Tarjeta con borde inferior grueso, como las del resto de la app. */
@Composable
fun OutlinedPanel(
    modifier: Modifier = Modifier,
    borderColor: Color = LocalExtra.current.outline,
    background: Color = MaterialTheme.colorScheme.surface,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val shape = RoundedCornerShape(18.dp)
    Box(
        modifier
            .clip(shape)
            .background(borderColor)
            .padding(start = 2.dp, end = 2.dp, top = 2.dp, bottom = 4.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(background)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
    ) { content() }
}

@Composable
fun ProgressPill(progress: Float, color: Color, modifier: Modifier = Modifier, height: Dp = 16.dp) {
    val extra = LocalExtra.current
    Box(modifier.height(height).clip(RoundedCornerShape(50)).background(extra.locked)) {
        if (progress > 0f) {
            Box(
                Modifier.fillMaxWidth(progress.coerceIn(0f, 1f)).height(height)
                    .clip(RoundedCornerShape(50)).background(color)
            ) {
                // brillo superior
                Box(
                    Modifier.padding(horizontal = 8.dp, vertical = 3.dp).fillMaxWidth().height(height / 4)
                        .clip(RoundedCornerShape(50)).background(Color.White.copy(alpha = 0.3f))
                )
            }
        }
    }
}

@Composable
fun StatChip(icon: String, value: String, color: Color, modifier: Modifier = Modifier) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        Text(icon, fontSize = 20.sp)
        Spacer(Modifier.width(4.dp))
        Text(value, color = color, fontWeight = FontWeight.ExtraBold, fontSize = 17.sp)
    }
}

@Composable
fun SectionTitle(text: String, modifier: Modifier = Modifier) {
    Text(
        text,
        modifier = modifier.padding(top = 20.dp, bottom = 10.dp),
        style = MaterialTheme.typography.titleMedium,
        color = MaterialTheme.colorScheme.onBackground,
    )
}

@Composable
fun StatTile(icon: String, value: String, label: String, modifier: Modifier = Modifier) {
    OutlinedPanel(modifier) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(icon, fontSize = 26.sp)
            Spacer(Modifier.width(10.dp))
            Column {
                Text(value, style = MaterialTheme.typography.titleMedium)
                Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
fun ChoiceChipRow(options: List<Pair<String, Int>>, selected: Int, onSelect: (Int) -> Unit) {
    val extra = LocalExtra.current
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        options.forEach { (label, value) ->
            val sel = value == selected
            Box(
                Modifier.weight(1f).clip(RoundedCornerShape(14.dp))
                    .background(if (sel) extra.selectedBg else MaterialTheme.colorScheme.surface)
                    .border(2.dp, if (sel) MaterialTheme.colorScheme.tertiary else extra.outline, RoundedCornerShape(14.dp))
                    .clickable { onSelect(value) }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(label, textAlign = TextAlign.Center, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                    color = if (sel) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.onSurface)
            }
        }
    }
}

@Composable
fun RowScope.Weight1() = Spacer(Modifier.weight(1f))

@Composable
fun Dot(color: Color, size: Dp = 10.dp) = Box(Modifier.size(size).clip(RoundedCornerShape(50)).background(color))
