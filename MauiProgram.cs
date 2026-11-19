using Microsoft.Extensions.Logging;
using QuizApp.Services;
using QuizApp.ViewModels;
using QuizApp.Views;

namespace QuizApp;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		builder.Services.AddSingleton<HistoryService>();
		builder.Services.AddSingleton<QuizStore>();

		builder.Services.AddTransient<TopicsViewModel>();
		builder.Services.AddTransient<QuizViewModel>();
		builder.Services.AddTransient<ResultViewModel>();
		builder.Services.AddTransient<HistoryViewModel>();
		builder.Services.AddTransient<EditQuizViewModel>();

		builder.Services.AddTransient<TopicsPage>();
		builder.Services.AddTransient<QuizPage>();
		builder.Services.AddTransient<ResultPage>();
		builder.Services.AddTransient<HistoryPage>();
		builder.Services.AddTransient<EditQuizPage>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
