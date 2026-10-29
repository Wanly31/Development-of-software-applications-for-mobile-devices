import 'package:flutter/material.dart';

import '../store/expense_store.dart';
import '../utils/format.dart';
import '../widgets/month_selector.dart';

class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final total = store.monthTotal;
    final rows = store.byCategory;

    return Scaffold(
      appBar: AppBar(title: const Text('Статистика')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const MonthSelector(),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text('Витрачено за місяць'),
                  const SizedBox(height: 4),
                  Text(
                    formatMoney(total),
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  Text('Записів: ${store.monthItems.length}'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (rows.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: 32),
              child: Center(child: Text('Немає даних для статистики')),
            ),
          for (final row in rows)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(row.key.icon, color: row.key.color, size: 20),
                      const SizedBox(width: 8),
                      Expanded(child: Text(row.key.label)),
                      Text(
                        '${formatMoney(row.value)}  '
                        '(${(row.value / total * 100).toStringAsFixed(0)}%)',
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: row.value / total,
                      minHeight: 10,
                      color: row.key.color,
                      backgroundColor: row.key.color.withValues(alpha: 0.15),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
