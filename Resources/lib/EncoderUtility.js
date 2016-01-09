/**
 * @author Cole Halverson
 */

exports.encode_utf8 = function(string)
{
	result = unescape( encodeURIComponent(string));
	
	return result;
};

exports.decode_utf8 = function(string)
{
	result = decodeURIComponent(escape(string));
	return result;
};

