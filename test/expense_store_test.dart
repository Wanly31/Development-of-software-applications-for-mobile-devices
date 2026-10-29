import 'package:expense_tracker/models/expense.dart';
import 'package:expense_tracker/store/expense_store.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Expense _e(String id, double amount, Category c) => Expense(
      id: id,
      title: 'test $id',
      amount: amount,
      category: c,
      date: DateTime.now(),
    );

void main() {
  setUp(() => SharedPreferences.setMockInitialValues({}));

  test('рахує суму і групує по категоріях', () async {
    final store = ExpenseStore();
    await store.add(_e('1', 100, Category.food));
    await store.add(_e('2', 50, Category.food));
    await store.add(_e('3', 200, Category.transport));

    expect(store.monthTotal, 350);
    expect(store.byCategory.first.key, Category.transport);
    expect(store.byCategory.last.value, 150);
  });

  test('зберігає і завантажує дані', () async {
    final first = ExpenseStore();
    await first.add(_e('1', 42, Category.fun));

    final second = ExpenseStore();
    await second.load();
    expect(second.monthItems.single.amount, 42);
    expect(second.monthItems.single.category, Category.fun);
  });

  test('видаляє витрату', () async {
    final store = ExpenseStore();
    await store.add(_e('1', 10, Category.other));
    await store.remove('1');
    expect(store.monthItems, isEmpty);
  });

  test('інший місяць не показує поточні витрати', () async {
    final store = ExpenseStore();
    await store.add(_e('1', 10, Category.home));
    store.changeMonth(-1);
    expect(store.monthItems, isEmpty);
  });
}
