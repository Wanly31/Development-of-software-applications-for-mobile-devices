using QuizApp.ViewModels;

namespace QuizApp.Views;

public partial class TopicsPage : ContentPage
{
	readonly TopicsViewModel _vm;

	public TopicsPage(TopicsViewModel vm)
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
