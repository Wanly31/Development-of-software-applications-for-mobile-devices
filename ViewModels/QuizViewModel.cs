using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Windows.Input;
using QuizApp.Models;
using QuizApp.Services;

namespace QuizApp.ViewModels;

public class AnswerOption(string text, bool isCorrect) : BaseViewModel
{
	Color _color = Colors.SlateBlue;

	public string Text { get; } = text;
	public bool IsCorrect { get; } = isCorrect;

	public Color Color
	{
		get => _color;
		set => Set(ref _color, value);
	}
}

public class QuizViewModel : BaseViewModel, IQueryAttributable
{
	public const int SecondsPerQuestion = 15;

	readonly HistoryService _history;
	readonly QuizStore _store;
	readonly IDispatcherTimer _timer;
	readonly Stopwatch _stopwatch = new();
	List<Question> _questions = [];
	string _topic = "";
	int _index;
	int _score;
	int _timeLeft;
	bool _isAnswered;
	string _questionText = "";
	string _feedback = "";

	public QuizViewModel(HistoryService history, QuizStore store)
	{
		_history = history;
		_store = store;
		_timer = Dispatcher.GetForCurrentThread()!.CreateTimer();
		_timer.Interval = TimeSpan.FromSeconds(1);
		_timer.Tick += (_, _) => Tick();

		AnswerCommand = new Command<AnswerOption>(Answer);
		NextCommand = new Command(async () => await NextAsync());
	}

	public ObservableCollection<AnswerOption> Options { get; } = [];

	public ICommand AnswerCommand { get; }
	public ICommand NextCommand { get; }

	public string Topic => _topic;
	public string QuestionText { get => _questionText; private set => Set(ref _questionText, value); }
	public string Feedback { get => _feedback; private set => Set(ref _feedback, value); }
	public string ProgressText => $"Запитання {_index + 1} з {_questions.Count}";
	public double Progress => _questions.Count == 0 ? 0 : (double)(_index + 1) / _questions.Count;
	public string ScoreText => $"Рахунок: {_score}";

	public int TimeLeft
	{
		get => _timeLeft;
		private set
		{
			if (Set(ref _timeLeft, value)) OnPropertyChanged(nameof(TimeProgress));
		}
	}

	public double TimeProgress => (double)_timeLeft / SecondsPerQuestion;

	public bool IsAnswered
	{
		get => _isAnswered;
		private set => Set(ref _isAnswered, value);
	}

	public void ApplyQueryAttributes(IDictionary<string, object> query)
	{
		_topic = (string)query["topic"];
		_questions = _store.Get(_topic)!.Questions.OrderBy(_ => Random.Shared.Next()).ToList();
		_index = 0;
		_score = 0;
		OnPropertyChanged(nameof(Topic));
		_stopwatch.Restart();
		ShowQuestion();
	}

	public void Stop()
	{
		_timer.Stop();
		_stopwatch.Stop();
	}

	void ShowQuestion()
	{
		var q = _questions[_index];
		QuestionText = q.Text;
		Feedback = "";
		IsAnswered = false;

		Options.Clear();
		foreach (var text in q.Options.OrderBy(_ => Random.Shared.Next()))
			Options.Add(new AnswerOption(text, text == q.Correct));

		OnPropertyChanged(nameof(ProgressText));
		OnPropertyChanged(nameof(Progress));
		OnPropertyChanged(nameof(ScoreText));

		TimeLeft = SecondsPerQuestion;
		_timer.Start();
	}

	void Tick()
	{
		TimeLeft--;
		if (TimeLeft > 0) return;
		Reveal(null);
		Feedback = "Час вийшов!";
	}

	void Answer(AnswerOption option)
	{
		if (IsAnswered) return;
		Reveal(option);
		if (option.IsCorrect)
		{
			_score++;
			Feedback = "Правильно!";
		}
		else
		{
			Feedback = "Неправильно";
		}
		OnPropertyChanged(nameof(ScoreText));
	}

	// Підсвічує правильну відповідь зеленим, а обрану неправильну червоним.
	void Reveal(AnswerOption? chosen)
	{
		_timer.Stop();
		IsAnswered = true;
		foreach (var o in Options)
		{
			if (o.IsCorrect) o.Color = Colors.SeaGreen;
			else if (o == chosen) o.Color = Colors.IndianRed;
			else o.Color = Colors.Gray;
		}
	}

	async Task NextAsync()
	{
		if (_index < _questions.Count - 1)
		{
			_index++;
			ShowQuestion();
			return;
		}

		Stop();
		var result = new QuizResult
		{
			Topic = _topic,
			Score = _score,
			Total = _questions.Count,
			Seconds = (int)_stopwatch.Elapsed.TotalSeconds
		};
		_history.Add(result);

		// "../result" замінює сторінку гри, тож кнопка «Назад» веде одразу до тем.
		await Shell.Current.GoToAsync("../result", new Dictionary<string, object> { ["result"] = result });
	}
}
