using QuizApp.ViewModels;

namespace QuizApp.Views;

public partial class EditQuizPage : ContentPage
{
	public EditQuizPage(EditQuizViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
	}
}
