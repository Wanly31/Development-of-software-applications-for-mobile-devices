using System.Windows.Input;
using QuizApp.Models;

namespace QuizApp.ViewModels;

public class ResultViewModel : BaseViewModel, IQueryAttributable
{
	QuizResult _result = new();

	public ResultViewModel()
	{
		AgainCommand = new Command(async () =>
			await Shell.Current.GoToAsync("../quiz", new Dictionary<string, object> { ["topic"] = _result.Topic }));
		HomeCommand = new Command(async () => await Shell.Current.GoToAsync(".."));
	}

	public ICommand AgainCommand { get; }
	public ICommand HomeCommand { get; }

	public string Topic => _result.Topic;
	public string ScoreText => $"{_result.Score} / {_result.Total}";
	public double Percent => _result.Percent;
	public string TimeText => $"Час: {_result.Seconds} с";

	public string Message => _result.Percent switch
	{
		1.0 =>"Ідеально! Жодної помилки.",
		>= 0.7 => "Чудовий результат!",
		>= 0.4 => "Непогано, але можна краще.",
		_ => "Варто спробувати ще раз."
	};

	public void ApplyQueryAttributes(IDictionary<string, object> query)
	{
		_result = (QuizResult)query["result"];
		OnPropertyChanged(string.Empty);
	}
}
