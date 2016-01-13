/**
 * The main delegator for the app for login, startup, relaunches
 */
// Imports
var config = require('config');
var httpClient = require('lib/HttpClient');

var whateverDB = require('lib/WhateverDB');
var MainWindow = require('ui/common/MainWindow');
var ActivateWindow = require('ui/common/ActivateWindow');

// Main launch function
exports.launch = function() {
	
	var mainWindow = new MainWindow();
	mainWindow.open();
		
	return mainWindow;
	
	Ti.API.info('context.launch');
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
	
	httpClient.doPost('/v1/registerDevice', request, function(success, response) {
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
exports.register = function() {
	if(config.platform === 'iphone') {
		if(config.major < 8) {
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
			}
		else
			{
			Ti.App.iOS.registerUserNotificationSettings({
				types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
				});
			
			Ti.Network.registerForPushNotifications({
				success: deviceTokenSuccess,
				error: deviceTokenError,
				callback: receivePush
				});
			}
		
		function receivePush(e)
			{
				Ti.API.info('RECIEVED PUSH!!');
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
			Ti.API.info('device_token' + e.deviceToken);
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
		var Gcm = require('ti.cloudmessaging');
		
		Gcm.init({
			senderId: '823842470448', // Google API Key
			groupedMessageTitle: 'Conversation' // The title used in a notification if there is more than one
			});
		
		// Receives messages or payloads while the app is focused and not in the background
		Gcm.addEventListener('receiveMessage', function(e) {
			Ti.API.info("receiveMessage");
			Ti.API.info(JSON.stringify(e));
			
			Ti.App.fireEvent(e.event);
			});
		
		Gcm.registerDevice({
			success: registerDeviceSuccess,
			error: registerDeviceError
			});
		
		function registerDeviceSuccess(e) {
			registerDevice(e.deviceToken, 'ANDROID');
			}
			
		function registerDeviceError(e)
			{
			// Initialization Error
			if(e.code == Gcm.INIT_ERROR) {
				Ti.API.error("GCM Initialization Error: " + JSON.stringify(e));
				}
			
			// Google Play Services Not Ready
			if(e.code == Gcm.GOOGLE_PLAY_NOT_READY_ERROR) {
				alert(L('google_play_unavailable') + ' ' + e.message);
				}
			
			// Registration Error
			if(e.code == Gcm.GCM_REGISTRATION_FAILED) {
				if(e.message == 'SERVICE_NOT_AVAILABLE') {
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