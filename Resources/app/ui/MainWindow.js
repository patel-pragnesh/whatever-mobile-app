function MainWindow()
	{
	var config = require('app/config');
	var moment = require('lib/moment');
	var _ = require('lib/underscore');
	var httpClient = require('lib/httpclient');
	
	var whatever = require('app/whatever');
	
	var mainBackgroundColor = '#dbdbdb';
	
	// Create the main window
	var win = require('app/ui/common/Window').create();
	win.backgroundColor = mainBackgroundColor;
	
	if(config.platform === config.platform_android)
		{
		win.exitOnClose = true;
		}
		
	var windowFocusCallback = function(e)
		{
		win.removeEventListener('focus', windowFocusCallback);
		
		// Register the device for push
		whatever.register();
		};
		
	win.addEventListener('focus', windowFocusCallback);
	
	// The menu view when the tray opens
	var trayView = require('app/ui/common/TrayView').create({backgroundColor: '#6d6d6d'});
	win.add(trayView);
	
	var navigationContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '100%',
		top: 0,
		layout: 'vertical'
		});
		
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('app/ui/common/NotificationView').create();
		
	var navigationGradient = '/images/nav-background-gradient-50.png';
	var navigationHeight = 50;
	
	// Compensate for the iPhone status bar
	if(config.platform === 'iphone' && config.major >= 7)
		{
		navigationHeight = 70;
		navigationGradient = '/images/nav-background-gradient-70.png';
		}
		
	var navigationView = Ti.UI.createView({
		backgroundImage: navigationGradient,
		height: navigationHeight,
		width: '100%'
		});
	
	navigationContainer.add(navigationView);
	win.add(navigationContainer);
	
	var mainContainerView = Ti.UI.createView({
		width: '100%',
		top: navigationHeight,
		bottom: 0,
		layout: 'vertical',
		zIndex: 1
		});
	
	var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    
    var defaultSliderSize = 120;
    var dayViewOffSet = (((60 * hours) + minutes) - defaultSliderSize) * -1;
    
    var availabilityBarView = require('app/ui/fragment/DayView').create();
	mainContainerView.add(availabilityBarView);
		
	var sliderSeparatorView = Ti.UI.createView({
		backgroundColor: '#a4a4a4',
		top: 0,
		height: 1,
		width: '100%'
		});
		
	mainContainerView.add(sliderSeparatorView);
	
	var scrollableView = Ti.UI.createScrollableView({
		backgroundColor: mainBackgroundColor,
		top: 0,
		bottom: 0,
		width: '100%'
		});
	
	for(var i = 0; i < 10; i++)
		{
		var conversation = Ti.UI.createView({
			top: 0,
			height: '100%',
			width: '100%'
			});
			
		scrollableView.addView(conversation);
		}
		
	mainContainerView.add(scrollableView);
	
	win.add(mainContainerView);
	win.add(notificationView);

	return win;
	};

module.exports = MainWindow;