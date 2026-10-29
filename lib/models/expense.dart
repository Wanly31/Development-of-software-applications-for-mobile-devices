import 'package:flutter/material.dart';

enum Category {
  food('Їжа', Icons.restaurant, Colors.orange),
  transport('Транспорт', Icons.directions_bus, Colors.blue),
  home('Дім', Icons.home, Colors.brown),
  fun('Розваги', Icons.celebration, Colors.purple),
  health('Здоров\'я', Icons.favorite, Colors.red),
  other('Інше', Icons.more_horiz, Colors.grey);

  const Category(this.label, this.icon, this.color);

  final String label;
  final IconData icon;
  final Color color;
}

class Expense {
  Expense({
    required this.id,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
  });

  final String id;
  final String title;
  final double amount;
  final Category category;
  final DateTime date;

  Expense copyWith({
    String? title,
    double? amount,
    Category? category,
    DateTime? date,
  }) {
    return Expense(
      id: id,
      title: title ?? this.title,
      amount: amount ?? this.amount,
      category: category ?? this.category,
      date: date ?? this.date,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'amount': amount,
        'category': category.name,
        'date': date.toIso8601String(),
      };

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'] as String,
      title: json['title'] as String,
      amount: (json['amount'] as num).toDouble(),
      category: Category.values.firstWhere(
        (c) => c.name == json['category'],
        orElse: () => Category.other,
      ),
      date: DateTime.parse(json['date'] as String),
    );
  }
}
