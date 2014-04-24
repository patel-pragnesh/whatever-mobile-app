/**
 * Loads the country code prefixes for phone numbers
 */
exports.getCountryCodes = function()
	{
	var countryCodes = [];
	var country = {};
	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'xml/countrycodes.xml');
	
	var xmltext = f.read().text;
	var doc = Ti.XML.parseString(xmltext).documentElement;
	var countries = doc.getElementsByTagName("country");
	
	for(var c = 0; c < countries.length; c++)
		{
		var country = countries.item(c);
		country.country = country.getAttribute("name");
		country.type = country.getAttribute("type");
		country.code = country.text;
		
		countryCodes.push(country);
		}
		
	return countryCodes;
	};

/**
 * Attempts to get the country code for this device
 */
exports.getDeviceCode = function()
	{
	return "1";
	};