/**
 * Contains basic programmatically derived constants for the entire application
 */

// The key the server requires so the JSON services remain secure just to the app
exports.app_key = Ti.App.guid;

// The mode of the app
var mode;

/**
 * Set the application mode - this can be used to add code that does not run in simulation
 * Also it is used to set specific runtime config variables below
 */
if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 )
	{
	mode = 'development';
	// export.mode = 'production';
	}
else
	{
	mode = 'production';
	}

// Set the services base url for testing and production
if(mode === 'development')
	{
	if(Ti.Platform.osname === 'android')
		{
		exports.services_base_url = 'http://10.0.2.2:8888'; // The android test 'localhost' url
		}
	else
		{
		exports.services_base_url = 'http://localhost:8888';
		}
	}
else
	{
	exports.services_base_url = 'http://api.whateverapp.com';
	}
	
exports.mode = mode;

if(Ti.Platform.osname === 'android')
	{
	exports.pluto_reg = 'PlutoRegular';
	exports.pluto_bold = 'PlutoBold';
	exports.pluto_sans_reg = 'PlutoSansRegular';
	exports.pluto_sans_bold = 'PlutoSansBold';
	}
else
	{
	exports.pluto_reg = 'Pluto';
	exports.pluto_bold = 'Pluto';
	exports.pluto_sans_reg = 'Pluto Sans';
	exports.pluto_sans_bold = 'Pluto Sans';
	}
	
exports.viewOffset = '75%';	

	
// Used to create platform specific UI or logic differences
exports.platform = Ti.Platform.osname;