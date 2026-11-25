package com.example.bookshelf.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import java.util.concurrent.Executors
import kotlinx.coroutines.runBlocking

@Database(entities = [Book::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun bookDao(): BookDao

    companion object {
        fun create(context: Context): AppDatabase {
            lateinit var db: AppDatabase
            db = Room.databaseBuilder(context, AppDatabase::class.java, "books.db")
                .addCallback(object : Callback() {
                    // При першому запуску кладемо кілька книжок, щоб полиця не була порожньою.
                    override fun onCreate(connection: SupportSQLiteDatabase) {
                        Executors.newSingleThreadExecutor().execute {
                            runBlocking { sampleBooks().forEach { db.bookDao().upsert(it) } }
                        }
                    }
                })
                .build()
            return db
        }

        private fun sampleBooks(): List<Book> {
            val day = 24 * 60 * 60 * 1000L
            val now = System.currentTimeMillis()
            return listOf(
                Book(title = "Тигролови", author = "Іван Багряний", pages = 320, currentPage = 320,
                    status = BookStatus.DONE, rating = 5, note = "Читається на одному диханні",
                    addedAt = now - 40 * day, finishedAt = now - 20 * day),
                Book(title = "Кайдашева сім'я", author = "Іван Нечуй-Левицький", pages = 224, currentPage = 224,
                    status = BookStatus.DONE, rating = 4, addedAt = now - 30 * day, finishedAt = now - 10 * day),
                Book(title = "Чистий код", author = "Роберт Мартін", pages = 464, currentPage = 180,
                    status = BookStatus.READING, addedAt = now - 7 * day),
                Book(title = "Місто", author = "Валер'ян Підмогильний", pages = 288, currentPage = 95,
                    status = BookStatus.READING, addedAt = now - 3 * day),
                Book(title = "Дюна", author = "Френк Герберт", pages = 704,
                    status = BookStatus.WANT, addedAt = now - day),
            )
        }
    }
}
