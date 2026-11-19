using System.Text.Json;
using QuizApp.Models;

namespace QuizApp.Services;

// Вбудовані теми з QuestionBank плюс вікторини, які створив користувач.
// Свої вікторини лежать у quizzes.json у папці застосунку.
public class QuizStore
{
	readonly string _path = Path.Combine(FileSystem.AppDataDirectory, "quizzes.json");
	List<Topic>? _custom;

	List<Topic> Custom => _custom ??= Load();

	public IEnumerable<Topic> All => QuestionBank.Topics.Concat(Custom);

	public Topic? Get(string name) => All.FirstOrDefault(t => t.Name == name);

	// originalName дозволяє зберегти вікторину під тією ж назвою під час редагування.
	public bool IsNameTaken(string name, string? originalName) =>
		All.Any(t => t.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase) && t.Name != originalName);

	public void Save(Topic topic, string? originalName)
	{
		var index = originalName == null ? -1 : Custom.FindIndex(t => t.Name == originalName);
		if (index == -1)
			Custom.Add(topic);
		else
			Custom[index] = topic;
		Persist();
	}

	public void Delete(string name)
	{
		Custom.RemoveAll(t => t.Name == name);
		Persist();
	}

	List<Topic> Load()
	{
		if (!File.Exists(_path)) return [];
		return JsonSerializer.Deserialize<List<Topic>>(File.ReadAllText(_path)) ?? [];
	}

	void Persist() => File.WriteAllText(_path, JsonSerializer.Serialize(Custom));
}
