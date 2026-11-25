package com.example.bookshelf

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.bookshelf.ui.BookViewModel
import com.example.bookshelf.ui.EditBookScreen
import com.example.bookshelf.ui.ShelfScreen
import com.example.bookshelf.ui.StatsScreen

private val BookColors = lightColorScheme(
    primary = Color(0xFF6D4C41),
    secondary = Color(0xFFA1887F),
    primaryContainer = Color(0xFFD7CCC8),
    secondaryContainer = Color(0xFFEFEBE9),
    surfaceVariant = Color(0xFFF5EEE9),
    background = Color(0xFFFFFBF7),
    surface = Color(0xFFFFFBF7)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val dao = (application as BookShelfApp).database.bookDao()
        setContent {
            MaterialTheme(colorScheme = BookColors) {
                val vm: BookViewModel = viewModel(factory = viewModelFactory {
                    initializer { BookViewModel(dao) }
                })
                BookShelfNav(vm)
            }
        }
    }
}

@Composable
private fun BookShelfNav(vm: BookViewModel) {
    val nav = rememberNavController()
    val books by vm.books.collectAsStateWithLifecycle()
    val stats by vm.stats.collectAsStateWithLifecycle()
    val route = nav.currentBackStackEntryAsState().value?.destination?.route

    // Нижня панель видна лише на двох головних екранах, форма відкривається на весь екран.
    Scaffold(
        bottomBar = {
            if (route == "shelf" || route == "stats") {
                NavigationBar {
                    NavigationBarItem(
                        selected = route == "shelf",
                        onClick = { nav.navigate("shelf") { popUpTo("shelf"); launchSingleTop = true } },
                        icon = { Icon(Icons.AutoMirrored.Filled.List, null) },
                        label = { Text("Полиця") }
                    )
                    NavigationBarItem(
                        selected = route == "stats",
                        onClick = { nav.navigate("stats") { popUpTo("shelf"); launchSingleTop = true } },
                        icon = { Icon(Icons.Filled.Info, null) },
                        label = { Text("Статистика") }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(nav, startDestination = "shelf", modifier = Modifier.padding(bottom = padding.calculateBottomPadding())) {
            composable("shelf") {
                ShelfScreen(
                    books = books,
                    onAdd = { nav.navigate("edit") },
                    onOpen = { nav.navigate("edit?id=${it.id}") }
                )
            }
            composable("stats") {
                StatsScreen(stats)
            }
            composable(
                "edit?id={id}",
                arguments = listOf(navArgument("id") { type = NavType.LongType; defaultValue = -1L })
            ) { entry ->
                val id = entry.arguments?.getLong("id")?.takeIf { it != -1L }
                EditBookScreen(id = id, viewModel = vm, onBack = { nav.popBackStack() })
            }
        }
    }
}
