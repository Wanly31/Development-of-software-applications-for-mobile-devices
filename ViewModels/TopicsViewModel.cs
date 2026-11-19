using System.Collections.ObjectModel;
using System.Windows.Input;
using QuizApp.Services;

namespace QuizApp.ViewModels;

public record TopicCard(string Name, string Description, string Info, bool IsCustom);

public class TopicsViewModel : BaseViewModel
{
	readonly HistoryService _history;
	readonly QuizStore _store;

	public TopicsViewModel(HistoryService history, QuizStore store)
	{
		_history = history;
		_store = store;

		StartCommand = new Command<TopicCard>(async card =>
			await Shell.Current.GoToAsync("quiz", new Dictionary<string, object> { ["topic"] = card.Name }));
		CreateCommand = new Command(async () => await Shell.Current.GoToAsync("editquiz"));
		EditCommand = new Command<TopicCard>(async card =>
			await Shell.Current.GoToAsync("editquiz", new Dictionary<string, object> { ["topic"] = card.Name }));
		DeleteCommand = new Command<TopicCard>(async card =>
		{
			var ok = await Shell.Current.DisplayAlertAsync("Видалити вікторину?", card.Name, "Так", "Ні");
			if (!ok) return;
			_store.Delete(card.Name);
			Refresh();
		});
	}

	public ObservableCollection<TopicCard> Topics { get; } = [];

	public ICommand StartCommand { get; }
	public ICommand CreateCommand { get; }
	public ICommand EditCommand { get; }
	public ICommand DeleteCommand { get; }

	// Перечитуємо теми й рекорди щоразу, коли сторінка з'являється.
	public void Refresh()
	{
		Topics.Clear();
		foreach (var t in _store.All)
		{
			var best = _history.Best(t.Name);
			var info = best == null
				? $"{t.Questions.Count} запитань · ще не грали"
				: $"{t.Questions.Count} запитань · рекорд {best.Score}/{best.Total}";
			Topics.Add(new TopicCard(t.Name, t.Description, info, t.IsCustom));
		}
	}
}
