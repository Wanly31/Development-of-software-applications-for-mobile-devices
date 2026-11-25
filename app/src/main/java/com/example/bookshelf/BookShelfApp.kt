package com.example.bookshelf

import android.app.Application
import com.example.bookshelf.data.AppDatabase

class BookShelfApp : Application() {
    val database: AppDatabase by lazy { AppDatabase.create(this) }
}
