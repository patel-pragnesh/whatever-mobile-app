var flurry = require('com.sofisoftwarellc.tiflurry');
var config = require('whateverapp/config/config');

/**
 * Abstracted the analytics event logging
 */
exports.logEvent = function(ae, dictionary)
	{
	if(config.mode === 'production')
		{
		flurry.logEvent(ae, dictionary);
		}
	};