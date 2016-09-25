/**
 * The app.js file is the first file to get hit when the app starts up
 * Simply cascades logic and sets initial variables and calls the .launch() function located in context.js
 */
(function()
	{
		
	var launching = true;
	var config = require('config');
	var _ = require('lib/Underscore');
	
	
	var whateverDB = require('lib/WhateverDB');
	//var newrelic = require('ti.newrelic').start("AA8d163585f446346bb693944e06f5d5f64b37fede");
	var context = require('context');
	
	Ti.UI.backgroundColor = 'white';
	
	// Create a boolean property used to track whether the app is online
	Ti.App.Properties.setBool('online', Ti.Network.online);
	
	// Change listener for the network
	Ti.Network.addEventListener('change', function(e)
		{
		Ti.App.Properties.setBool('online', e.online);
		});
		
	function resumed()
		{

		Titanium.UI.iOS.setAppBadge(0);
		
		var pause = setTimeout(function()
			{
			if(!_.isNull(Ti.App.Properties.getString('device_token')))
				{
				context.registerDevice(Ti.App.Properties.getString('device_token'), 'IOS');
				}
			else
				{
				if(!_.isNull(Ti.App.Properties.getObject("account")))
					{
					context.register();
					}
				}
			
			// Make sure there is an account associated with the app
			if(!_.isNull(Ti.App.Properties.getObject("account")))
				{
					//TODO should there be something here??
				
				}
				
			}, 500);
		}
	
	/**
	 * Launch the app
	 */
	
	//make sure the local db for conversations exists
	whateverDB.buildDB();
	
	if(_.isNull(Ti.App.Properties.getObject('account')))
		{
		var activateWindow = context.activate();
		}
	else
		{
		var mainWindow = context.launch();
		}
		
	if(config.platform === config.platform_iphone)
		{
		Ti.App.addEventListener('paused', function()
			{
			
			});
			
		Ti.App.addEventListener('resumed', function()
			{
			// Not sure if this is a bug - but after initial launch resume gets called even when app is launching second time
			if(config.major < 8)
				{
				resumed();
				}
			else
				{
				if(launching)
					{
					launching = false;
					}
				else
					{
					resumed();
					}
				}
			});
		}
	else
		{
		
		}
	})();