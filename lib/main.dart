import 'package:flutter/material.dart';

import 'screens/expenses_screen.dart';
import 'screens/stats_screen.dart';
import 'store/expense_store.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final store = ExpenseStore();
  await store.load();
  runApp(ExpenseApp(store: store));
}

class ExpenseApp extends StatelessWidget {
  const ExpenseApp({super.key, required this.store});

  final ExpenseStore store;

  @override
  Widget build(BuildContext context) {
    return StoreScope(
      store: store,
      child: MaterialApp(
        title: 'Трекер витрат',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorSchemeSeed: Colors.teal,
          useMaterial3: true,
        ),
        darkTheme: ThemeData(
          colorSchemeSeed: Colors.teal,
          brightness: Brightness.dark,
          useMaterial3: true,
        ),
        home: const HomeShell(),
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _tab,
        children: const [ExpensesScreen(), StatsScreen()],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.list), label: 'Витрати'),
          NavigationDestination(icon: Icon(Icons.pie_chart), label: 'Статистика'),
        ],
      ),
    );
  }
}
