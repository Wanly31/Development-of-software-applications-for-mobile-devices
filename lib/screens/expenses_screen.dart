import 'package:flutter/material.dart';

import '../store/expense_store.dart';
import '../utils/format.dart';
import '../widgets/expense_tile.dart';
import '../widgets/month_selector.dart';
import 'edit_expense_screen.dart';

class ExpensesScreen extends StatelessWidget {
  const ExpensesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final items = store.monthItems;

    return Scaffold(
      appBar: AppBar(title: const Text('Мої витрати')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const EditExpenseScreen()),
        ),
        child: const Icon(Icons.add),
      ),
      body: Column(
        children: [
          const MonthSelector(),
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              'Разом: ${formatMoney(store.monthTotal)}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: items.isEmpty
                ? const Center(child: Text('За цей місяць витрат немає'))
                : ListView.builder(
                    itemCount: items.length,
                    itemBuilder: (context, i) {
                      final e = items[i];
                      return Dismissible(
                        key: ValueKey(e.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          color: Colors.red,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        onDismissed: (_) {
                          store.remove(e.id);
                          ScaffoldMessenger.of(context)
                            ..hideCurrentSnackBar()
                            ..showSnackBar(SnackBar(
                              content: Text('Видалено «${e.title}»'),
                              action: SnackBarAction(
                                label: 'Повернути',
                                onPressed: () => store.add(e),
                              ),
                            ));
                        },
                        child: ExpenseTile(
                          expense: e,
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => EditExpenseScreen(expense: e),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
