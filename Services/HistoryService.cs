using System.Text.Json;
using QuizApp.Models;

namespace QuizApp.Services;

// Історія спроб лежить у Preferences як один JSON-рядок.
public class HistoryService
{
	const string Key = "history";

	public List<QuizResult> GetAll()
	{
		var json = Preferences.Default.Get(Key, "");
		if (json == "") return [];
		return JsonSerializer.Deserialize<List<QuizResult>>(json) ?? [];
	}

	public void Add(QuizResult result)
	{
		var all = GetAll();
		all.Insert(0, result);
		Preferences.Default.Set(Key, JsonSerializer.Serialize(all));
	}

	public void Clear() => Preferences.Default.Remove(Key);

	public QuizResult? Best(string topic) => GetAll()
		.Where(r => r.Topic == topic)
		.OrderByDescending(r => r.Score)
		.ThenBy(r => r.Seconds)
		.FirstOrDefault();
}
