/**
 * Contains basic programmatically derived constants for the entire application
 */
// The key the server requires so the JSON services remain secure just to the app
exports.app_key = Ti.App.guid;

// The mode of the app
var mode;
var mode_production = 'production';
var mode_development = 'development';

/**
 * Set the application mode - this can be used to add code that does not run in simulation
 * Also it is used to set specific runtime config variables below
 */
if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 )
	{
	mode = mode_development;
	}
else
	{
	mode = mode_production;
	}
	
exports.mode = mode;
exports.mode_production = mode_production;
exports.mode_development = mode_development;

var platform = Ti.Platform.osname;
var platform_android = 'android';
var platform_iphone = 'iphone';

exports.platform = platform;
exports.platform_android = platform_android;
exports.platform_iphone = platform_iphone;

// Set the services base url for testing and production
if(mode === mode_development)
	{
	if(Ti.Platform.osname === platform_android)
		{
		exports.services_base_url = 'http://10.0.2.2:8080';
		}
	else
		{
		exports.services_base_url = 'http://localhost:8080';
		}
	}
else
	{
	exports.services_base_url = 'https://whatever-api.appspot.com';
	}
	
// Export the font names
exports.opensans_bold = 'OpenSans-Bold';
exports.opensans_extrabold = 'OpenSans-ExtraBold';
exports.opensans_light = 'OpenSans-Light';
exports.opensans_regular = 'OpenSans-Regular';
exports.opensans_semibold = 'OpenSans-Semibold';
exports.capita_light = 'Capita-Light';

// Set the version for the platform
// Currently used to set the top of a window for iOS 7
// http://docs.appcelerator.com/titanium/latest/#!/guide/iOS_7_Migration_Guide
var version = Titanium.Platform.version.split(".");
exports.major = parseInt(version[0],10);
