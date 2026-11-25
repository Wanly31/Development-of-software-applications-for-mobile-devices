package com.example.bookshelf.data

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class BookStatus(val label: String, val short: String) {
    WANT("Хочу прочитати", "Хочу"),
    READING("Читаю", "Читаю"),
    DONE("Прочитано", "Прочитано")
}

@Entity(tableName = "books")
data class Book(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val author: String,
    val pages: Int,
    val currentPage: Int = 0,
    val status: BookStatus = BookStatus.WANT,
    val rating: Int = 0,
    val note: String = "",
    val addedAt: Long = System.currentTimeMillis(),
    val finishedAt: Long? = null
)

val Book.progress: Float
    get() = if (pages == 0) 0f else (currentPage.toFloat() / pages).coerceIn(0f, 1f)
