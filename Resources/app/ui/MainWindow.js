function MainWindow()
	{
	var config = require('app/config');
	var moment = require('lib/moment');
	var _ = require('lib/underscore');
	var httpClient = require('lib/httpclient');
	
	var whatever = require('app/whatever');
	
	// Create the main window
	var win = require('app/ui/common/Window').create();
	
	if(config.platform === config.platform_android)
		{
		win.exitOnClose = true;
		}
	
	// The menu view when the tray opens
	var trayView = require('app/ui/common/TrayView').create({backgroundColor: '#6d6d6d'});
	win.add(trayView);
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('app/ui/common/NotificationView').create();
	
	var navigationHeight = 0;
	
	// Compensate for the iPhone status bar
	if(config.platform === 'iphone' && config.major >= 7)
		{
		navigationHeight = 20;
		
		var navigationView = Ti.UI.createView({
			backgroundImage: '/images/nav-background-gradient-20.png',
			top: 0,
			height: 20,
			width: '100%'
			});
		
		var decoratorView = Ti.UI.createView({
			backgroundColor: '#221233',
			height: 1,
			bottom: 0,
			width: '100%'
			});
			
		navigationView.add(decoratorView);
		win.add(navigationView);
		}
	
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
    
    var availabilityView = require('app/ui/fragment/AvailabilityView').create();
	mainContainerView.add(availabilityView);
		
	var sliderSeparatorView = Ti.UI.createView({
		backgroundColor: '#221233',
		top: 0,
		height: 1,
		width: '100%'
		});
		
	mainContainerView.add(sliderSeparatorView);
	
	var scrollableView = Ti.UI.createScrollableView({
		backgroundColor: "#efefef",
		top: 0,
		bottom: 0,
		width: '100%'
		});
		
	var scrollViewArgs = {
		showVerticalScrollIndicator: true,
		showHorizontalScrollIndicator: false,
		top: 0,
		bottom: 0,
		width: '100%',
		layout: 'vertical'
		};
		
	if(config.platform !== 'android')
		{
		scrollViewArgs.disableBounce = true;
		}
	
	// Create the conversations
	for(var i = 0; i < 10; i++)
		{
		var fakeTime = moment().add(i, "hour");
		var conversation = Ti.UI.createScrollView(scrollViewArgs);
		
		var conversationView = Ti.UI.createView({
			backgroundColor: 'white',
			borderWidth: 1,
			borderColor: '#dfdfdf',
			borderRadius: 3,
			top: 10,
			left: 10,
			right: 10,
			bottom: 10
			});
			
		conversation.add(conversationView);
			
		var bottomShim = Ti.UI.createView({
			height: 10,
			width: '100%'
			});
		
		conversation.add(bottomShim);
		scrollableView.addView(conversation);
		}
		
	mainContainerView.add(scrollableView);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	function updateViews()
		{
		availabilityView.updateView();
		}
		
	Ti.App.addEventListener("update_views", updateViews);
	
	var windowPostLayoutCallback = function(e)
		{
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		updateViews();
		};
	
	win.addEventListener('postlayout', windowPostLayoutCallback);
	
	var windowFocusCallback = function(e)
		{
		win.removeEventListener('focus', windowFocusCallback);
		
		// Register the device for push
		whatever.register();
		};
		
	win.addEventListener('focus', windowFocusCallback);

	return win;
	};

module.exports = MainWindow;