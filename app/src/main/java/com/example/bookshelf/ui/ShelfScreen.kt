package com.example.bookshelf.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.bookshelf.data.Book
import com.example.bookshelf.data.BookStatus
import com.example.bookshelf.data.progress

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShelfScreen(
    books: List<Book>,
    onAdd: () -> Unit,
    onOpen: (Book) -> Unit,
    modifier: Modifier = Modifier
) {
    var tab by rememberSaveable { mutableIntStateOf(1) }
    val status = BookStatus.entries[tab]
    val visible = books.filter { it.status == status }

    Scaffold(
        modifier = modifier,
        topBar = { TopAppBar(title = { Text("Книжкова полиця") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = onAdd) {
                Icon(Icons.Filled.Add, "Додати книжку")
            }
        }
    ) { padding ->
        Column(Modifier.padding(padding)) {
            TabRow(selectedTabIndex = tab) {
                BookStatus.entries.forEachIndexed { i, s ->
                    val count = books.count { it.status == s }
                    Tab(
                        selected = tab == i,
                        onClick = { tab = i },
                        text = { Text("${s.short} ($count)", textAlign = TextAlign.Center, maxLines = 1) }
                    )
                }
            }

            if (visible.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Тут поки порожньо", color = MaterialTheme.colorScheme.outline)
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(visible, key = { it.id }) { book ->
                        BookCard(book, onClick = { onOpen(book) })
                    }
                }
            }
        }
    }
}

@Composable
private fun BookCard(book: Book, onClick: () -> Unit) {
    Card(Modifier.fillMaxWidth().clickable(onClick = onClick)) {
        Column(Modifier.padding(16.dp)) {
            Text(book.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text(book.author, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.outline)
            Spacer(Modifier.height(8.dp))

            when (book.status) {
                BookStatus.READING -> {
                    LinearProgressIndicator(
                        progress = { book.progress },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "${book.currentPage} з ${book.pages} стор. · ${(book.progress * 100).toInt()}%",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                BookStatus.DONE -> Row(verticalAlignment = Alignment.CenterVertically) {
                    RatingBar(book.rating)
                    Spacer(Modifier.weight(1f))
                    Text("${book.pages} стор.", style = MaterialTheme.typography.bodySmall)
                }
                BookStatus.WANT -> Text("${book.pages} стор.", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
