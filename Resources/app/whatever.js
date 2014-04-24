/**
 * The main delegator for the app for login, startup, relaunches
 */
// Imports
var config = require('app/config');
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