function MainWindow()
	{
	var config = require('app/config');
	var moment = require('lib/moment');
	var _ = require('lib/underscore');
	var httpClient = require('lib/httpclient');
	
	var mainBackgroundColor = '#dbdbdb';
	
	// Create the main window
	var win = require('app/ui/common/Window').create();
	win.backgroundColor = mainBackgroundColor;
	
	var windowOpenCallback = function(e)
		{
		win.removeEventListener('open', windowOpenCallback);
		registerDevice();
		};
		
	win.addEventListener('open', windowOpenCallback);
	
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
	
	/**
	 * Register the device for push notifications
	 * Called when the window open event is called
	 */
	function registerDevice()
		{
		if(config.platform === 'iphone')
			{
			Ti.Network.registerForPushNotifications({
				types: [
				Ti.Network.NOTIFICATION_TYPE_BADGE,
				Ti.Network.NOTIFICATION_TYPE_ALERT,
				Ti.Network.NOTIFICATION_TYPE_SOUND
				],
				success: deviceTokenSuccess,
				error: deviceTokenError,
				callback: receivePush
				});
			
			function receivePush(e)
				{
				Ti.API.info('Received push: ' + JSON.stringify(e));
				
				//alert(e.data.event);
				}
				
			function deviceTokenSuccess(e)
				{
				//postDeviceId(e.deviceToken, 'ios');
				}
			
			function deviceTokenError(e)
				{
				// TODO Message here
				//alert('Failed to register for push notifications! ' + e.error);
				}
			}
		else
			{
			// Google Cloud Messaging API
			var Gcm = require('ti.gcm');
			Gcm.init('823842470448');
			
			Gcm.registerDevice({
				success: registerDeviceSuccess,
				error: registerDeviceError,
				receive: receiveMessage
				});
			
			function registerDeviceSuccess(e)
				{
				//postDeviceId(e.deviceToken, 'android');
				}
				
			function registerDeviceError(e)
				{
				// Initialization Error
				if(e.code == Gcm.INIT_ERROR)
					{
					alert(e.message);
					}
				
				// Google Play Services Not Ready
				if(e.code == Gcm.GOOGLE_PLAY_NOT_READY_ERROR)
					{
					alert(e.message);
					}
				
				// Registration Error
				if(e.code == Gcm.GCM_REGISTRATION_FAILED)
					{
					if(e.message == 'SERVICE_NOT_AVAILABLE')
						{
						// TODO Message
						}
					else
						{
						
						}
						
					Ti.API.error(e.message);
					}
				}
				
			function receiveMessage(e)
				{
				Ti.API.info(JSON.stringify(e));
				alert(e.event);
				}
			}
		};
	
	/**
	 * Used for both android and ios device registration with the server
	 * Sends the device id to be stored with the user account
	 * 
	 * @param {Object} deviceId
	 * @param {Object} deviceType
	 */
	function postDeviceId(deviceId, deviceType)
		{
		var account = Ti.App.Properties.getObject("account");
						
		var request = {};
		request.app_id = config.app_key;
		request.device_type = deviceType;
		request.device_id = deviceId;
		request.user_id = account.user_id;
		
		var envelope = {};
		envelope.push_auth = request;
		
		Ti.API.info(JSON.stringify(envelope));
		
		httpClient.doPost(config.push_auths, envelope, function(success, response)
			{
			if(!success)
				{
				// Set it to null to check this again next time
				Ti.App.Properties.setString('device_token', null);
				Ti.API.error("Error Registering Device Id With Server " + JSON.stringify(response));
				}
			});
		};
	
	return win;
	};

module.exports = MainWindow;