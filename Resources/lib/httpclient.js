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
			callback(false, JSON.parse(this.responseText));
            },
            
        timeout: 29000
        });
    
    xhr.open('POST', url);
    
    if(!_.isNull(Ti.App.Properties.getString("session_token")) || !_.isEmpty(Ti.App.Properties.getString("session_token")))
    	{
    	xhr.setRequestHeader(config.authentication_header, Ti.App.Properties.getString("session_token"));
    	}
    
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
			callback(false, JSON.parse(this.responseText));
            },
            
        timeout: 29000
        });
    
    xhr.open('GET', url);
    
    if(!_.isNull(Ti.App.Properties.getString("session_token")) || !_.isEmpty(Ti.App.Properties.getString("session_token")))
    	{
    	xhr.setRequestHeader(config.authentication_header, Ti.App.Properties.getString("session_token"));
    	}
	
	// Send the payload
	xhr.send();
	};

exports.doPatch = function(endpoint, request, callback)
	{
	var url = config.services_base_url + endpoint;
	
	var xhr = Ti.Network.createHTTPClient({
        onload: function(e)
            {
            callback(true, JSON.parse(this.responseText));
            },
        onerror: function(e)
            {
			callback(false, JSON.parse(this.responseText));
            },
            
        timeout: 29000
        });
    
    xhr.open('POST', url);
    
    xhr.setRequestHeader(config.authentication_header, Ti.App.Properties.getString("session_token"));
    
    // Override the POST method since Java support for PATCH is a problem
    xhr.setRequestHeader('X-HTTP-Method-Override', 'PATCH');
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
	
	// Send the payload
	xhr.send(JSON.stringify(request));
	};