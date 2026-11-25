package com.example.bookshelf.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.bookshelf.data.Book
import com.example.bookshelf.data.BookStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditBookScreen(
    id: Long?,
    viewModel: BookViewModel,
    onBack: () -> Unit
) {
    var original by remember { mutableStateOf<Book?>(null) }
    var title by rememberSaveable { mutableStateOf("") }
    var author by rememberSaveable { mutableStateOf("") }
    var pages by rememberSaveable { mutableStateOf("") }
    var current by rememberSaveable { mutableStateOf("") }
    var status by rememberSaveable { mutableStateOf(BookStatus.WANT) }
    var rating by rememberSaveable { mutableStateOf(0) }
    var note by rememberSaveable { mutableStateOf("") }
    var error by rememberSaveable { mutableStateOf<String?>(null) }
    var confirmDelete by remember { mutableStateOf(false) }

    LaunchedEffect(id) {
        if (id == null) return@LaunchedEffect
        viewModel.get(id)?.let { b ->
            original = b
            title = b.title
            author = b.author
            pages = b.pages.toString()
            current = b.currentPage.toString()
            status = b.status
            rating = b.rating
            note = b.note
        }
    }

    fun save() {
        val total = pages.toIntOrNull()
        val read = current.toIntOrNull() ?: 0
        error = when {
            title.isBlank() -> "Введіть назву"
            author.isBlank() -> "Введіть автора"
            total == null || total <= 0 -> "Кількість сторінок має бути більше нуля"
            read < 0 || read > total -> "Прочитано не може бути більше, ніж сторінок у книжці"
            else -> null
        }
        if (error != null || total == null) return

        val base = original ?: Book(title = "", author = "", pages = 0)
        viewModel.save(
            base.copy(
                title = title.trim(),
                author = author.trim(),
                pages = total,
                currentPage = if (status == BookStatus.WANT) 0 else read,
                status = status,
                rating = if (status == BookStatus.DONE) rating else 0,
                note = note.trim()
            )
        )
        onBack()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (id == null) "Нова книжка" else "Редагування") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Назад")
                    }
                },
                actions = {
                    if (original != null) {
                        IconButton(onClick = { confirmDelete = true }) {
                            Icon(Icons.Filled.Delete, "Видалити")
                        }
                    }
                }
            )
        }
    ) { padding ->
        Column(
            Modifier
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(title, { title = it }, Modifier.fillMaxWidth(), label = { Text("Назва") })
            OutlinedTextField(author, { author = it }, Modifier.fillMaxWidth(), label = { Text("Автор") })

            Text("Статус", style = MaterialTheme.typography.titleSmall)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                BookStatus.entries.forEach { s ->
                    FilterChip(
                        selected = status == s,
                        onClick = { status = s },
                        label = { Text(s.label) }
                    )
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    pages, { pages = it.filter(Char::isDigit) },
                    Modifier.weight(1f),
                    label = { Text("Сторінок") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                if (status == BookStatus.READING) {
                    OutlinedTextField(
                        current, { current = it.filter(Char::isDigit) },
                        Modifier.weight(1f),
                        label = { Text("Прочитано") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                    )
                }
            }

            if (status == BookStatus.DONE) {
                Text("Оцінка", style = MaterialTheme.typography.titleSmall)
                RatingBar(rating, size = 32.dp, onChange = { rating = it })
            }

            OutlinedTextField(
                note, { note = it },
                Modifier.fillMaxWidth(),
                label = { Text("Нотатка") },
                minLines = 3
            )

            error?.let { Text(it, color = MaterialTheme.colorScheme.error) }

            Button(onClick = ::save, modifier = Modifier.fillMaxWidth()) {
                Text("Зберегти")
            }
        }
    }

    if (confirmDelete) {
        AlertDialog(
            onDismissRequest = { confirmDelete = false },
            title = { Text("Видалити книжку?") },
            text = { Text(original?.title ?: "") },
            confirmButton = {
                TextButton(onClick = {
                    original?.let(viewModel::delete)
                    confirmDelete = false
                    onBack()
                }) { Text("Видалити") }
            },
            dismissButton = {
                TextButton(onClick = { confirmDelete = false }) { Text("Скасувати") }
            }
        )
    }
}
