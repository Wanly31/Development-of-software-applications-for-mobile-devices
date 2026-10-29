import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/expense.dart';

const _storageKey = 'expenses';

class ExpenseStore extends ChangeNotifier {
  final List<Expense> _items = [];
  DateTime _month = DateTime(DateTime.now().year, DateTime.now().month);

  DateTime get month => _month;

  // Витрати за обраний місяць, новіші зверху.
  List<Expense> get monthItems {
    final list = _items
        .where((e) => e.date.year == _month.year && e.date.month == _month.month)
        .toList();
    list.sort((a, b) => b.date.compareTo(a.date));
    return list;
  }

  double get monthTotal => monthItems.fold(0, (sum, e) => sum + e.amount);

  // Сума по кожній категорії за місяць, від найбільшої.
  List<MapEntry<Category, double>> get byCategory {
    final totals = <Category, double>{};
    for (final e in monthItems) {
      totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    }
    return totals.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
  }

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_storageKey);
    if (raw == null) return;
    final list = jsonDecode(raw) as List;
    _items
      ..clear()
      ..addAll(list.map((j) => Expense.fromJson(j as Map<String, dynamic>)));
    notifyListeners();
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _storageKey,
      jsonEncode(_items.map((e) => e.toJson()).toList()),
    );
  }

  void changeMonth(int delta) {
    _month = DateTime(_month.year, _month.month + delta);
    notifyListeners();
  }

  Future<void> add(Expense e) async {
    _items.add(e);
    notifyListeners();
    await _save();
  }

  Future<void> update(Expense e) async {
    final i = _items.indexWhere((x) => x.id == e.id);
    if (i == -1) return;
    _items[i] = e;
    notifyListeners();
    await _save();
  }

  Future<void> remove(String id) async {
    _items.removeWhere((e) => e.id == id);
    notifyListeners();
    await _save();
  }
}

// Дає доступ до стору будь-якому віджету нижче по дереву.
class StoreScope extends InheritedNotifier<ExpenseStore> {
  const StoreScope({super.key, required ExpenseStore store, required super.child})
      : super(notifier: store);

  static ExpenseStore of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<StoreScope>()!.notifier!;
  }
}
