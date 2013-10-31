function IntroductionWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	
	// The main window
	var win = Ti.UI.createWindow({
		backgroundColor: 'transparent',
		height: '90%',
		width: '90%',
		orientationModes: [Ti.UI.PORTRAIT]
		});
		
	if(config.platform === 'android')
		{
		win.fullscreen = false;
		win.navBarHidden = true;
		
		win.addEventListener('androidback', function(e)
			{
			closeWindow();
			});
		}
	else
		{
		win.borderRadius = 5;
		}
		
	var welcomeView = createIntroView();
	
	var welcomeLabel = Ti.UI.createLabel({
		color: 'white',
		font:
			{
			fontSize: 36,
			fontFamily: config.pluto_sans_reg
			},
		textAlign: 'center',
		text: 'Welcome',
		top: 20
		});
		
	welcomeView.add(welcomeLabel);
	
	var gettingStartedView = createIntroView();
	
	var howItWorksView = createIntroView();
	
	var doneButton = Ti.UI.createButton({
		title: 'Done',
		width: 80,
		height: 50
		});
		
	doneButton.addEventListener('click', closeWindow);
		
	howItWorksView.add(doneButton);
		
	function createIntroView(view_args)
		{
		var introView = Ti.UI.createView({
			backgroundColor: '#000000',
			width: '100%',
			height: '100%'
			});
		
		return introView;
		};
	
	var scrollableView = Ti.UI.createScrollableView({
		views:[welcomeView, gettingStartedView, howItWorksView],
		showPagingControl: true
		});
		
	win.add(scrollableView);
	
	function closeWindow()
		{
		Ti.App.Properties.setBool('showintro', false);
		win.close();
		};
    	
	return win;
	};

module.exports = IntroductionWindow;