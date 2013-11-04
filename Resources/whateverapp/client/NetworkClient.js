var config = require('whateverapp/config/config');

/*
 * Methods to check if the device has a network
 * If the device has a network, then check the server status
 */
exports.isOnline = function(callback)
	{
	/*
	 * Test the device to make sure we have a network connection on startup
	 */
	if(!Ti.App.Properties.getBool('online'))
		{
		callback(false);
		}
	else
		{
		/*
		 * Test the server status
		 */
		var xhr = Ti.Network.createHTTPClient(
			{
			onload: function(g)
				{
				if(this.responseText === null)
					{
					callback(false);
					}
				else
					{
					/*
					 * These responses relate to the app engine - issues would make the response be 'down'
					 */
					if(this.responseText === 'DOWN') // Down due to App Engine issues
						{
						callback(false);
						}
					else
						{
						callback(true);
						}
	                }
	            },
	        onerror: function(g)
	            {
	            callback(false);
	            },
	            
	        timeout: 29000
	        });
	        
	    var url = config.services_base_url + '/api/v1/getstatus';
	        
	    xhr.open("GET", url);
	    xhr.setRequestHeader("x-key", config.app_key);
	    xhr.send();
		}
	};