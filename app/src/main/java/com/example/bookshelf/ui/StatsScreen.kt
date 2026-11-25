package com.example.bookshelf.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatsScreen(stats: Stats, modifier: Modifier = Modifier) {
    Scaffold(
        modifier = modifier,
        topBar = { TopAppBar(title = { Text("Статистика") }) }
    ) { padding ->
        Column(
            Modifier
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatTile("Усього книжок", stats.total.toString(), Modifier.weight(1f))
                StatTile("Прочитано цього року", stats.doneThisYear.toString(), Modifier.weight(1f))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                StatTile("Прочитано сторінок", stats.pagesRead.toString(), Modifier.weight(1f))
                StatTile(
                    "Середня оцінка",
                    if (stats.averageRating == 0.0) "—" else String.format(Locale.US, "%.1f", stats.averageRating),
                    Modifier.weight(1f)
                )
            }

            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("За статусом", style = MaterialTheme.typography.titleMedium)
                    StatusRow("Хочу прочитати", stats.want, stats.total)
                    StatusRow("Читаю", stats.reading, stats.total)
                    StatusRow("Прочитано", stats.done, stats.total)
                }
            }

            stats.favoriteAuthor?.let {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Найчастіший автор серед прочитаних", style = MaterialTheme.typography.bodySmall)
                        Text(it, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun StatTile(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier) {
        Column(Modifier.padding(16.dp).fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Text(label, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
private fun StatusRow(label: String, count: Int, total: Int) {
    Column {
        Row {
            Text(label, Modifier.weight(1f))
            Text(count.toString(), fontWeight = FontWeight.Bold)
        }
        LinearProgressIndicator(
            progress = { if (total == 0) 0f else count.toFloat() / total },
            modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
        )
    }
}
