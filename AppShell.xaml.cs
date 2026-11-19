using QuizApp.Views;

namespace QuizApp;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();
		Routing.RegisterRoute("quiz", typeof(QuizPage));
		Routing.RegisterRoute("result", typeof(ResultPage));
		Routing.RegisterRoute("editquiz", typeof(EditQuizPage));
	}
}
