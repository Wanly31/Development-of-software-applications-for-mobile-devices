using QuizApp.ViewModels;

namespace QuizApp.Views;

public partial class QuizPage : ContentPage
{
	readonly QuizViewModel _vm;

	public QuizPage(QuizViewModel vm)
	{
		InitializeComponent();
		BindingContext = _vm = vm;
	}

	// Якщо користувач вийшов посеред гри, таймер не має тікати далі.
	protected override void OnDisappearing()
	{
		base.OnDisappearing();
		_vm.Stop();
	}
}
