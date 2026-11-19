using System.Collections.ObjectModel;
using System.Windows.Input;
using QuizApp.Models;
using QuizApp.Services;

namespace QuizApp.ViewModels;

// Створення нової вікторини або редагування своєї: назву наявної передають параметром "topic".
public class EditQuizViewModel : BaseViewModel, IQueryAttributable
{
	readonly QuizStore _store;
	string? _originalName;
	string _name = "";
	string _description = "";
	string _questionText = "";
	string _correct = "";
	string _wrong1 = "";
	string _wrong2 = "";
	string _wrong3 = "";
	string _error = "";

	public EditQuizViewModel(QuizStore store)
	{
		_store = store;
		Questions.CollectionChanged += (_, _) => OnPropertyChanged(nameof(QuestionsHeader));

		AddQuestionCommand = new Command(AddQuestion);
		RemoveQuestionCommand = new Command<Question>(q => Questions.Remove(q));
		SaveCommand = new Command(async () => await SaveAsync());
	}

	public ObservableCollection<Question> Questions { get; } = [];

	public ICommand AddQuestionCommand { get; }
	public ICommand RemoveQuestionCommand { get; }
	public ICommand SaveCommand { get; }

	public string PageTitle => _originalName == null ? "Нова вікторина" : "Редагування";
	public string QuestionsHeader => $"Запитання ({Questions.Count})";

	public string Name { get => _name; set => Set(ref _name, value); }
	public string Description { get => _description; set => Set(ref _description, value); }
	public string QuestionText { get => _questionText; set => Set(ref _questionText, value); }
	public string Correct { get => _correct; set => Set(ref _correct, value); }
	public string Wrong1 { get => _wrong1; set => Set(ref _wrong1, value); }
	public string Wrong2 { get => _wrong2; set => Set(ref _wrong2, value); }
	public string Wrong3 { get => _wrong3; set => Set(ref _wrong3, value); }

	public string Error
	{
		get => _error;
		set { Set(ref _error, value); OnPropertyChanged(nameof(HasError)); }
	}

	public bool HasError => Error.Length > 0;

	public void ApplyQueryAttributes(IDictionary<string, object> query)
	{
		if (!query.TryGetValue("topic", out var value) || _store.Get((string)value) is not { } topic)
			return;

		_originalName = topic.Name;
		Name = topic.Name;
		Description = topic.Description;
		foreach (var q in topic.Questions) Questions.Add(q);
		OnPropertyChanged(nameof(PageTitle));
	}

	void AddQuestion()
	{
		// Правильна відповідь іде першою, порожні неправильні варіанти пропускаємо.
		var options = new[] { Correct, Wrong1, Wrong2, Wrong3 }
			.Select(o => o.Trim())
			.Where(o => o.Length > 0)
			.ToArray();

		if (string.IsNullOrWhiteSpace(QuestionText))
			Error = "Введіть текст запитання";
		else if (string.IsNullOrWhiteSpace(Correct))
			Error = "Введіть правильну відповідь";
		else if (options.Length < 2)
			Error = "Потрібен хоча б один неправильний варіант";
		else if (options.Distinct(StringComparer.CurrentCultureIgnoreCase).Count() != options.Length)
			Error = "Варіанти відповідей не мають повторюватися";
		else
		{
			Questions.Add(new Question(QuestionText.Trim(), options));
			QuestionText = Correct = Wrong1 = Wrong2 = Wrong3 = "";
			Error = "";
		}
	}

	async Task SaveAsync()
	{
		var name = Name.Trim();
		if (name.Length == 0)
			Error = "Введіть назву вікторини";
		else if (_store.IsNameTaken(name, _originalName))
			Error = "Вікторина з такою назвою вже є";
		else if (Questions.Count == 0)
			Error = "Додайте хоча б одне запитання";
		else
		{
			var description = Description.Trim().Length > 0 ? Description.Trim() : "Своя вікторина";
			_store.Save(new Topic(name, description, Questions.ToList(), IsCustom: true), _originalName);
			await Shell.Current.GoToAsync("..");
		}
	}
}
