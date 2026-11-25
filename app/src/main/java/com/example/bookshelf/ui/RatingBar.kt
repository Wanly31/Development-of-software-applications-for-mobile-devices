package com.example.bookshelf.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

private val StarOn = Color(0xFFFFB300)
private val StarOff = Color(0xFFD7CCC8)

@Composable
fun RatingBar(rating: Int, size: Dp = 18.dp, onChange: ((Int) -> Unit)? = null) {
    Row {
        for (i in 1..5) {
            val tint = if (i <= rating) StarOn else StarOff
            if (onChange == null) {
                Icon(Icons.Filled.Star, null, tint = tint, modifier = Modifier.size(size))
            } else {
                IconButton(onClick = { onChange(if (i == rating) 0 else i) }) {
                    Icon(Icons.Filled.Star, "Оцінка $i", tint = tint, modifier = Modifier.size(size))
                }
            }
        }
    }
}
