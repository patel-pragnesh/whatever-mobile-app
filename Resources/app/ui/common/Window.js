/**
 * The default window
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args)
	{
	var config = require('app/config');
	
	var win = Ti.UI.createWindow({
		width: '100%',
		fullscreen: false,
		orientationModes: [Ti.UI.PORTRAIT]
		});

	if(config.platform === config.platform_android)
		{
		win.navBarHidden = true;
		win.height = '100%';
		}
		
	return win;
	};