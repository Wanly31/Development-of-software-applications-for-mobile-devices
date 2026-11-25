package com.example.bookshelf.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bookshelf.data.Book
import com.example.bookshelf.data.BookDao
import com.example.bookshelf.data.BookStatus
import java.util.Calendar
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class Stats(
    val total: Int = 0,
    val want: Int = 0,
    val reading: Int = 0,
    val done: Int = 0,
    val doneThisYear: Int = 0,
    val pagesRead: Int = 0,
    val averageRating: Double = 0.0,
    val favoriteAuthor: String? = null
)

class BookViewModel(private val dao: BookDao) : ViewModel() {

    val books: StateFlow<List<Book>> = dao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    val stats: StateFlow<Stats> = dao.observeAll()
        .map(::calculateStats)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), Stats())

    suspend fun get(id: Long): Book? = dao.get(id)

    fun save(book: Book) = viewModelScope.launch {
        val fixed = when {
            book.status == BookStatus.DONE && book.finishedAt == null ->
                book.copy(finishedAt = System.currentTimeMillis(), currentPage = book.pages)
            book.status != BookStatus.DONE -> book.copy(finishedAt = null)
            else -> book
        }
        dao.upsert(fixed)
    }

    fun delete(book: Book) = viewModelScope.launch { dao.delete(book) }

    private fun calculateStats(books: List<Book>): Stats {
        val year = Calendar.getInstance().get(Calendar.YEAR)
        val done = books.filter { it.status == BookStatus.DONE }
        val rated = done.filter { it.rating > 0 }
        return Stats(
            total = books.size,
            want = books.count { it.status == BookStatus.WANT },
            reading = books.count { it.status == BookStatus.READING },
            done = done.size,
            doneThisYear = done.count { b ->
                b.finishedAt?.let { Calendar.getInstance().apply { timeInMillis = it }.get(Calendar.YEAR) } == year
            },
            pagesRead = books.sumOf { it.currentPage },
            averageRating = if (rated.isEmpty()) 0.0 else rated.map { it.rating }.average(),
            favoriteAuthor = done.groupingBy { it.author }.eachCount().maxByOrNull { it.value }?.key
        )
    }
}
