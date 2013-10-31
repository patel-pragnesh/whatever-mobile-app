/**
 * The app.js file is the first file to get hit when the app starts up
 * Simply cascades logic and sets initial variables and calls the .launch() function located in whatever.js
 */
(function()
	{
	// Imports
	// New Relic is the application performance monitoring module
	var newrelic = require('ti.newrelic').start("AA8d163585f446346bb693944e06f5d5f64b37fede");
	var whatever = require('whateverapp/whatever');
	var config = require('whateverapp/config');
	
	if(Ti.App.Properties.getString('appstate') === null)
		{
		Ti.App.Properties.setString('appstate', 'launching');
		}
		
	if(Ti.App.Properties.getBool('showintro') === null)
		{
		Ti.App.Properties.setBool('showintro', true);
		}
	
	Ti.UI.backgroundColor = 'white';
	
	// Create a boolean property used to track whether the app is online
	Ti.App.Properties.setBool('online', Ti.Network.online);
	
	// Change listener for the network
	Ti.Network.addEventListener('change', function(e)
		{
		Ti.App.Properties.setBool('online', e.online);
		});
	
	/**
	 * Launch the whatever app
	 */
	whatever.launch(); // TODO - add network availability check
		
	if(config.platform !== 'android')
		{
		Ti.App.addEventListener('paused', function()
			{
			// Scaffolded for a pause event need
			});
			
		Ti.App.addEventListener('resume', function()
			{
			// Set a pause so that we get all the network listener information
			var pause = setTimeout(function()
				{
				// Scaffolded for a pause event need
				// Maintain the timeout pause so that iOS can 'hear' the network
				}, 500);
			});
		}
	})();