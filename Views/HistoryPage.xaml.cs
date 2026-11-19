using QuizApp.ViewModels;

namespace QuizApp.Views;

public partial class HistoryPage : ContentPage
{
	readonly HistoryViewModel _vm;

	public HistoryPage(HistoryViewModel vm)
	{
		InitializeComponent();
		BindingContext = _vm = vm;
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();
		_vm.Refresh();
	}
}
