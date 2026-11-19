using System.Collections.ObjectModel;
using System.Windows.Input;
using QuizApp.Models;
using QuizApp.Services;

namespace QuizApp.ViewModels;

public class HistoryViewModel : BaseViewModel
{
	readonly HistoryService _history;
	string _summary = "";

	public HistoryViewModel(HistoryService history)
	{
		_history = history;
		ClearCommand = new Command(async () =>
		{
			if (Results.Count == 0) return;
			var ok = await Shell.Current.DisplayAlertAsync("Очистити історію?", "Усі результати буде видалено.", "Так", "Ні");
			if (!ok) return;
			_history.Clear();
			Refresh();
		});
	}

	public ObservableCollection<QuizResult> Results { get; } = [];

	public ICommand ClearCommand { get; }

	public string Summary
	{
		get => _summary;
		private set => Set(ref _summary, value);
	}

	public void Refresh()
	{
		Results.Clear();
		foreach (var r in _history.GetAll()) Results.Add(r);

		Summary = Results.Count == 0
			? "Ви ще не пройшли жодної вікторини"
			: $"Ігор: {Results.Count} · середній результат {Results.Average(r => r.Percent):P0}";
	}
}
