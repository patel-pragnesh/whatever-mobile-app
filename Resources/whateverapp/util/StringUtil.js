exports.trim = function(string)
	{
	if(string.length > 0)
		{
		string = string.replace(/^\s+|\s+$/g, '');
		}
		
	return string;
	};

/*
 * Does the username match the regular expression
 * a-zA-Z0-9_
 * Use ^[a-zA-Z0-9]+$ to disallow underscore.
 * Note that both of these require the string not to be empty. Using * instead of + allows empty strings
 * 
 * Allow underscores but no spaces
 */
exports.validUsername = function(username)
	{
	return username.match(/^[a-zA-Z0-9_]+$/);
	};

// Alphanumerics only, no underscores
exports.validPassword = function(password)
	{
	return password.match(/^[a-zA-Z0-9]+$/);
	};

// Alpha characters only, hyphen and space
exports.validName = function(name)
	{
	return name.match(/^[a-zA-Z-]*$/);
	};