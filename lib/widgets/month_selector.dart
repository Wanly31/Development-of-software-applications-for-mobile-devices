import 'package:flutter/material.dart';

import '../store/expense_store.dart';
import '../utils/format.dart';

class MonthSelector extends StatelessWidget {
  const MonthSelector({super.key});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => store.changeMonth(-1),
        ),
        SizedBox(
          width: 160,
          child: Text(
            formatMonth(store.month),
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: () => store.changeMonth(1),
        ),
      ],
    );
  }
}
