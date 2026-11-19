using System.Text.Json.Serialization;

namespace QuizApp.Models;

public class QuizResult
{
	public string Topic { get; set; } = "";
	public int Score { get; set; }
	public int Total { get; set; }
	public int Seconds { get; set; }
	public DateTime Date { get; set; } = DateTime.Now;

	[JsonIgnore]
	public double Percent => Total == 0 ? 0 : (double)Score / Total;

	[JsonIgnore]
	public string ScoreText => $"{Score} з {Total} ({Percent:P0})";

	[JsonIgnore]
	public string Details => $"{Date:dd.MM.yyyy HH:mm} · {Seconds} с";
}
