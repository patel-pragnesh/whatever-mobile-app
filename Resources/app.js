/**
 * The app.js file is the first file to get hit when the app starts up
 * Simply cascades logic and sets initial variables and calls the .launch() function located in whatever.js
 */
(function()
	{
	var config = require('app/config');
	var _ = require('lib/underscore');
	
	//var newrelic = require('ti.newrelic').start("AA8d163585f446346bb693944e06f5d5f64b37fede");
	var whatever = require('app/whatever');
	
	Ti.UI.backgroundColor = 'white';
	
	// Create a boolean property used to track whether the app is online
	Ti.App.Properties.setBool('online', Ti.Network.online);
	
	// Change listener for the network
	Ti.Network.addEventListener('change', function(e)
		{
		Ti.App.Properties.setBool('online', e.online);
		});
	
	/**
	 * Launch the app
	 */
	if(_.isNull(Ti.App.Properties.getObject('account')))
		{
		var activateWindow = whatever.activate();
		}
	else
		{
		var mainWindow = whatever.launch();
		}
		
	if(config.platform === config.platform_iphone)
		{
		Ti.App.addEventListener('paused', function()
			{
			
			});
			
		Ti.App.addEventListener('resumed', function()
			{
			Ti.UI.iPhone.appBadge = 0;
				
			var pause = setTimeout(function()
				{
				if(!_.isNull(Ti.App.Properties.getString('device_token')))
					{
					whatever.registerDevice(Ti.App.Properties.getString('device_token'), 'IOS');
					}
				else
					{
					if(!_.isNull(Ti.App.Properties.getObject("account")))
						{
						whatever.register();
						}
					}
				
				// Make sure there is an account associated with the app
				if(!_.isNull(Ti.App.Properties.getObject("account")))
					{
					Ti.App.fireEvent('update_views');
					}
					
				}, 500);
			});
		}
	else
		{
		
		}
	})();