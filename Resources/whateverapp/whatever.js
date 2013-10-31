/**
 * The main delegator for the app for login, startup, relaunches
 */

// Imports
var config = require('whateverapp/config');

var MainWindow = require('whateverapp/ui/MainWindow');
var DelegateWindow = require('whateverapp/ui/DelegateWindow');
var IntroductionWindow = require('whateverapp/ui/IntroductionWindow');

// Main launch function
exports.launch = function()
	{
	/**
	 * Launch flow
	 * 
	 * Check for launch state - has this app launched ever 
	 * -- If not then we will launch a series of horizontal (ScrollableView)s introducing the app
	 * 
	 * If the app has launched we check for whether the introduction has been exited by the user
	 * -- If not we show the introduction
	 * 
	 * If the app has been launched and the introduction closed we check for an account
	 * -- No account, start
	 * 		-- If account exists, enter PIN code
	 * 			-- Success go to main start window
	 * 		-- If not, start account creation process
	 */
	if(getAccount() === null)
		{
		//var delegateWindow = new DelegateWindow();
		var delegateWindow = new MainWindow();
		if(config.platform === 'android')
			{
			function androidCloseWindowEvent(e)
				{
				var activity = Ti.Android.currentActivity;
				activity.finish();
				};
				
			delegateWindow.addEventListener('androidback', androidCloseWindowEvent);
			}
		
		delegateWindow.open(); 
		}
	else
		{
		var mainWindow = new MainWindow();
		
		if(config.platform === 'android')
			{
			function androidCloseWindowEvent(e)
				{
				var activity = Ti.Android.currentActivity;
				activity.finish();
				};
			
			mainWindow.addEventListener('androidback', androidCloseWindowEvent);
			}
		
		mainWindow.open();
		}
		
	if(config.platform !== 'android')
		{
		Ti.UI.backgroundColor = '#000000';
		}
	
	if(Ti.App.Properties.getBool('showintro'))
		{
		var introductionWindow = new IntroductionWindow();
		introductionWindow.open();
		}
	};
	
// Get an account that is stored in a property
// This is exported and accessbile across the app
function getAccount()
	{
	if(Ti.App.Properties.getString('account') != null)
		{
		return JSON.parse(Ti.App.Properties.getString('account'));
		}
	else
		{
		return null;
		}
	};

exports.getAccount = getAccount;