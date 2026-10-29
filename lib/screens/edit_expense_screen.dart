import 'package:flutter/material.dart';

import '../models/expense.dart';
import '../store/expense_store.dart';
import '../utils/format.dart';

// Один екран і для створення, і для редагування: якщо expense == null, це нова витрата.
class EditExpenseScreen extends StatefulWidget {
  const EditExpenseScreen({super.key, this.expense});

  final Expense? expense;

  @override
  State<EditExpenseScreen> createState() => _EditExpenseScreenState();
}

class _EditExpenseScreenState extends State<EditExpenseScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title;
  late final TextEditingController _amount;
  late Category _category;
  late DateTime _date;

  bool get _isNew => widget.expense == null;

  @override
  void initState() {
    super.initState();
    final e = widget.expense;
    _title = TextEditingController(text: e?.title ?? '');
    _amount = TextEditingController(text: e?.amount.toStringAsFixed(2) ?? '');
    _category = e?.category ?? Category.food;
    _date = e?.date ?? DateTime.now();
  }

  @override
  void dispose() {
    _title.dispose();
    _amount.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) setState(() => _date = picked);
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    final store = StoreScope.of(context);
    final amount = double.parse(_amount.text.replaceAll(',', '.'));

    if (_isNew) {
      store.add(Expense(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        title: _title.text.trim(),
        amount: amount,
        category: _category,
        date: _date,
      ));
    } else {
      store.update(widget.expense!.copyWith(
        title: _title.text.trim(),
        amount: amount,
        category: _category,
        date: _date,
      ));
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isNew ? 'Нова витрата' : 'Редагування'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _title,
              decoration: const InputDecoration(labelText: 'Назва'),
              textCapitalization: TextCapitalization.sentences,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Введіть назву' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _amount,
              decoration: const InputDecoration(
                labelText: 'Сума',
                suffixText: '₴',
              ),
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              validator: (v) {
                final n = double.tryParse((v ?? '').replaceAll(',', '.'));
                if (n == null || n <= 0) return 'Введіть суму більше нуля';
                return null;
              },
            ),
            const SizedBox(height: 20),
            Text('Категорія', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final c in Category.values)
                  ChoiceChip(
                    avatar: Icon(c.icon, size: 18, color: c.color),
                    label: Text(c.label),
                    selected: _category == c,
                    onSelected: (_) => setState(() => _category = c),
                  ),
              ],
            ),
            const SizedBox(height: 20),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.calendar_today),
              title: const Text('Дата'),
              subtitle: Text(formatDate(_date)),
              onTap: _pickDate,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: _save,
              icon: const Icon(Icons.check),
              label: const Text('Зберегти'),
            ),
          ],
        ),
      ),
    );
  }
}
