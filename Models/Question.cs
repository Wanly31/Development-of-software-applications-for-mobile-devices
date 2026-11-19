using System.Text.Json.Serialization;

namespace QuizApp.Models;

// Правильна відповідь завжди перша в Options, перемішуємо вже під час гри.
public record Question(string Text, string[] Options)
{
	[JsonIgnore]
	public string Correct => Options[0];

	[JsonIgnore]
	public string CorrectText => $"Правильна: {Correct} · варіантів: {Options.Length}";
}

public record Topic(string Name, string Description, IReadOnlyList<Question> Questions, bool IsCustom = false);
