var config = require('config');
var _ = require('lib/Underscore');

exports.doPost = function(endpoint, request, callback)
	{
	var url = config.services_base_url + endpoint;
	
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, JSON.parse(this.responseText));
            Ti.API.info('onload called, readyState = '+this.readyState);
            },
        onerror: function(e)
            {
			if(this.responseText)
            	{
            	var errorResponse;
            	
            	try
            		{
            		var errorResponse = JSON.parse(this.responseText);
            		callback(false, errorResponse);
            		}
            	catch(e) 
            		{
            		Ti.API.error(this.responseText);
            		callback(false, getHttpClientErrorResponse());
            		}
            	}
            else
            	{
            	callback(false, getHttpClientErrorResponse());
            	}
            },
            
        timeout:  29000
        });
    
    xhr.open('POST', url);
    
    xhr.setRequestHeader("x-key", config.app_key);
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
	xhr.setRequestHeader(config.namespace_header, config.namespace);
	
	// Send the payload
	xhr.send(JSON.stringify(request));
	};
	
exports.doGet = function(endpoint, callback)
	{
	var url = config.services_base_url + endpoint;
	Ti.API.info('url = ' + url);
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, JSON.parse(this.responseText));
            },
        onerror: function(e)
            {
			if(this.responseText)
            	{
            	var errorResponse;
            	
            	try
            		{
            		var errorResponse = JSON.parse(this.responseText);
            		callback(false, errorResponse);
            		}
            	catch(e) 
            		{
            		Ti.API.error(this.responseText);
            		callback(false, getHttpClientErrorResponse());
            		}
            	}
            else
            	{
            	callback(false, getHttpClientErrorResponse());
            	}
            },
            
        timeout: 29000
        });
    
    xhr.open('GET', url);
    xhr.setRequestHeader("x-key", config.app_key);
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader(config.namespace_header, config.namespace);
	xhr.send();
	};

exports.doMediaGet = function(endpoint, callback)
	{
	var url = config.services_base_url + endpoint;
	Ti.API.info('url = ' + url);
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, this.responseText);
            },
        onerror: function(e)
            {
			if(this.responseText)
            	{
            	var errorResponse;
            	
            	try
            		{
            		var errorResponse = this.responseText;
            		callback(false, errorResponse);
            		}
            	catch(e) 
            		{
            		Ti.API.error(this.responseText);
            		callback(false, getHttpClientErrorResponse());
            		}
            	}
            else
            	{
            	callback(false, getHttpClientErrorResponse());
            	}
            },
            
        timeout: 29000
        });
    
    xhr.open('GET', url);
    xhr.setRequestHeader("x-key", config.app_key);
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
    xhr.setRequestHeader(config.namespace_header, config.namespace);
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