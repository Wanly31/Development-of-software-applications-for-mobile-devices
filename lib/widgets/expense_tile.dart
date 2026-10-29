import 'package:flutter/material.dart';

import '../models/expense.dart';
import '../utils/format.dart';

class ExpenseTile extends StatelessWidget {
  const ExpenseTile({super.key, required this.expense, this.onTap});

  final Expense expense;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = expense.category;
    return ListTile(
      onTap: onTap,
      leading: CircleAvatar(
        backgroundColor: c.color.withValues(alpha: 0.15),
        child: Icon(c.icon, color: c.color),
      ),
      title: Text(expense.title),
      subtitle: Text('${c.label} · ${formatDate(expense.date)}'),
      trailing: Text(
        formatMoney(expense.amount),
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }
}
