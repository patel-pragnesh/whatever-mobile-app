/**
 * The main delegator for the app for login, startup, relaunches
 */
// Imports
var config = require('app/config');
var httpClient = require('lib/httpclient');

var MainWindow = require('app/ui/MainWindow');
var ActivateWindow = require('app/ui/ActivateWindow');

// Main launch function
exports.launch = function()
	{
	var mainWindow = new MainWindow();
	mainWindow.open();
		
	return mainWindow;
	};
	
exports.activate = function()
	{
	var activateWindow = new ActivateWindow();
	activateWindow.open();
		
	return activateWindow;
	};
	
/**
 * Used for both android and ios device registration with the server
 * Sends the device id to be stored with the user account
 * 
 * @param {Object} deviceId
 * @param {Object} deviceType
 */
function registerDevice(deviceId, deviceType)
	{
	var account = Ti.App.Properties.getObject("account");
						
	var request = {};
	request.device_type = deviceType;
	request.device_id = deviceId;
	request.user_id = account.id;
	
	Ti.API.info(JSON.stringify(request));
	
	httpClient.doPost('/v1/registerDevice', request, function(success, response)
		{
		Ti.API.info(JSON.stringify(response));
		
		if(!success)
			{
			// Set it to null to check this again next time
			Ti.App.Properties.setString('device_token', null);
			Ti.API.error("Error Registering Device Id With Server " + JSON.stringify(response));
			}
		});
	};
	
exports.registerDevice = registerDevice;

/**
 * Register a device for push notifications
 * 
 * @param {Object} pushCallback
 */
exports.register = function()
	{
	if(config.platform === 'iphone')
		{
		Ti.Network.registerForPushNotifications({
			types: [
			Ti.Network.NOTIFICATION_TYPE_BADGE,
			Ti.Network.NOTIFICATION_TYPE_ALERT,
			Ti.Network.NOTIFICATION_TYPE_SOUND
			],
			success: deviceTokenSuccess,
			error: deviceTokenError,
			callback: receivePush
			});
		
		function receivePush(e)
			{
			// iOS
			if(e.data && e.data.event)
				{
				Ti.App.fireEvent(e.data.event);
				}
			}
			
		function deviceTokenSuccess(e)
			{
			Ti.App.Properties.setString('device_token', e.deviceToken);
			registerDevice(e.deviceToken, 'IOS');
			}
		
		function deviceTokenError(e)
			{
			// TODO Message here
			alert('Failed to register for push notifications! ' + e.error);
			}
		}
	else
		{
		// Google Cloud Messaging API
		var Gcm = require('ti.gcm');
		
		Gcm.init({
			senderId: '823842470448', // Google API Key
			groupedMessageTitle: 'Conversation' // The title used in a notification if there is more than one
			});
		
		// Receives messages or payloads while the app is focused and not in the background
		Gcm.addEventListener('receiveMessage', function(e)
			{
			Ti.API.info("receiveMessage");
			Ti.API.info(JSON.stringify(e));
			
			Ti.App.fireEvent(e.event);
			});
		
		// The most recent queued message - typically from an app launch from pause event
		Gcm.addEventListener('queuedMessage', function(e)
			{
			Ti.API.info("receiveQueuedMessage");
			Ti.API.info(JSON.stringify(e));
			
			if(e.payloads)
				{
				for(var i = 0; i < e.payloads.length; i++)
					{
					Ti.API.info(JSON.stringify(e.payloads[i]));
					}
				}
				
			//alert(e.event);
			});
		
		// Messages that only contain a payload sans title and message
		Gcm.addEventListener('silentQueue', function(e)
			{
			Ti.API.info("silentQueue");
			
			if(e.payloads)
				{
				for(var i = 0; i < e.payloads.length; i++)
					{
					Ti.API.info(JSON.stringify(e.payloads[i]));
					}
				}

			});
		
		// The entire list of queued notifications when 1 or more notifications have occurred when the app is in the background
		Gcm.addEventListener('queuedNotifications', function(e)
			{
			Ti.API.info("queuedNotifications");
			
			if(e.payloads)
				{
				for(var i = 0; i < e.payloads.length; i++)
					{
					Ti.API.info(JSON.stringify(e.payloads[i]));
					}
				}
			
			});
		
		Gcm.registerDevice({
			success: registerDeviceSuccess,
			error: registerDeviceError
			});
		
		function registerDeviceSuccess(e)
			{
			registerDevice(e.deviceToken, 'ANDROID');
			}
			
		function registerDeviceError(e)
			{
			// Initialization Error
			if(e.code == Gcm.INIT_ERROR)
				{
				Ti.API.error("GCM Initialization Error: " + JSON.stringify(e));
				}
			
			// Google Play Services Not Ready
			if(e.code == Gcm.GOOGLE_PLAY_NOT_READY_ERROR)
				{
				alert(L('google_play_unavailable') + ' ' + e.message);
				}
			
			// Registration Error
			if(e.code == Gcm.GCM_REGISTRATION_FAILED)
				{
				if(e.message == 'SERVICE_NOT_AVAILABLE')
					{
					// TODO Message
					alert(L('gcm_no_services'));
					}
				else
					{
					// Ignore
					}
					
				Ti.API.error("GCM Registration Failure: " + JSON.stringify(e));
				}
			}
		}
	};