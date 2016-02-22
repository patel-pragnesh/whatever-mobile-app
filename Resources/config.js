/**
 * Contains basic programmatically derived constants for the entire application
 */
// The key the server requires so the JSON services remain secure just to the app
exports.app_key = '8083ea6e-a696-44ab-adb5-fb844a290500';


// The mode of the app
var mode;
var mode_production = 'production';
var mode_development = 'development';


//app colors
exports.purple = "#7945AD";

/**
 * Set the application mode - this can be used to add code that does not run in simulation
 * Also it is used to set specific runtime config variables below
 */
if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1)
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
		exports.services_base_url = 'http://10.0.2.2:8888';
		}
	else
		{
		exports.services_base_url = 'http://localhost:8080';
		//exports.services_base_url = 'https://whatever-api.appspot.com';
		}
	}
else
	{
	exports.services_base_url = 'https://whatever-api.appspot.com';
	}
	
exports.namespace_header = 'WebApplicationMode';
exports.namespace = (Ti.App.deployType !== 'production') ? 'dev' : 'prod';

//Name of the local database
exports.dbName = 'v1_DB';

//Local file to hold the user's profile picture
exports.profileFile = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile.jpg');


//Screen height and width of the device.  Used for sizing varius things and handling keyboardFrameChange events

exports.setDimensions = function(winHeight, winWidth)
{
	exports.winHeight = winHeight;
	exports.winWidth = winWidth;
};

	
// Export the font names
exports.opensans_bold = 'OpenSans-Bold';
exports.opensans_extrabold = 'OpenSans-ExtraBold';
exports.opensans_light = 'OpenSans-Light';
exports.opensans_regular = 'OpenSans-Regular';
exports.opensans_semibold = 'OpenSans-Semibold';
exports.ptserif_regular = 'PTSerif-Regular';

// Set the version for the platform
// Currently used to set the top of a window for iOS 7
// http://docs.appcelerator.com/titanium/latest/#!/guide/iOS_7_Migration_Guide
var version = Titanium.Platform.version.split(".");
exports.major = parseInt(version[0],10);

//variables to hold the the screen height and width of the phone.  Used to size the bubbles.
var winHeight;
var winWidth;