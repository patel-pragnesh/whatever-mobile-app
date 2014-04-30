var config = require('app/config');
var _ = require('lib/underscore');

exports.doPost = function(endpoint, request, callback)
	{
	var url = config.services_base_url + endpoint;
	
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, JSON.parse(this.responseText));
            },
        onerror: function(e)
            {
			if(this.responseText)
            	{
            	callback(false, JSON.parse(this.responseText));
            	}
            else
            	{
            	callback(false, JSON.parse(getHttpClientErrorResponse()));
            	}
            },
            
        timeout: 29000
        });
    
    xhr.open('POST', url);
    
    xhr.setRequestHeader("x-key", config.app_key);
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
	
	// Send the payload
	xhr.send(JSON.stringify(request));
	};
	
exports.doGet = function(endpoint, callback)
	{
	var url = config.services_base_url + endpoint;
	
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, JSON.parse(this.responseText));
            },
        onerror: function(e)
            {
			if(this.responseText)
            	{
            	callback(false, JSON.parse(this.responseText));
            	}
            else
            	{
            	callback(false, JSON.parse(getHttpClientErrorResponse()));
            	}
            },
            
        timeout: 29000
        });
    
    xhr.open('GET', url);
	xhr.send();
	};

/**
 * Get an http client error response onerror
 */
function getHttpClientErrorResponse()
	{
	var response = {};
	
	var errors = [];
	var error = {};
	error.name = 'http_client_error';
	
	errors.push(error);
	
	response.errors = errors;
	
	return response;
	}