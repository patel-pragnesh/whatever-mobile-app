/**
 * If no existing account is found, the delegate window is instantiated
 * This window gives the user the option to login or sign up for the app
 */
function DelegateWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	
	var LoginWindow = require('whateverapp/ui/LoginWindow');
	var SignupWindow = require('whateverapp/ui/SignupWindow');
	
	/*
	 * The main window
	 */
	var win = Ti.UI.createWindow({
		backgroundColor: '#333333',
		height: '100%',
		width: '100%',
		fullscreen: true,
		orientationModes: [Ti.UI.PORTRAIT]
		});
		
	if(config.platform === 'android')
		{
		win.navBarHidden = true;
		}
	else
		{
		win.borderRadius = 5;
		}
	
	var mainContainer = Ti.UI.createView({
		height: '100%',
		width: '100%',
		zIndex: 1
		});
		
	var notificationView = require('whateverapp/ui/common/NotificationView').create();
	
	/*
	 * Login Button and Create Account Buttons
	 */
	var loginBtn = Ti.UI.createButton({
		title : L('btn_login'),
		width : '100%',
		height : '20%',
		top : '60%',
		left : 0,
		color: 'black',
		backgroundColor : 'green',
		selectedColor : 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0,
		borderColor:'white'
		});

	//On click of the login button,
	//Go to the Login Window
	loginBtn.addEventListener('click', function(e)
		{
		var loginWindow = new LoginWindow();
		
		function focusEvent(e)
			{
			loginWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
			
		loginWindow.addEventListener('focus', focusEvent);
		
		loginWindow.open();
		});
		
	mainContainer.add(loginBtn);

	//Create Account Button
	var createAcctBtn = Ti.UI.createButton({
		title : L('btn_signup'),
		width : '100%',
		height : '20%',
		top : '80%',
		left : 0,
		color: 'black',
		backgroundColor : 'yellow',
		selectedColor : 'white',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0,
		borderColor:'white'
		});

	//On Click of the Create Account Button, 
	//Go to the SignupWindow
	createAcctBtn.addEventListener('click', function(e)
		{
		var signupWindow = new SignupWindow();
		
		function focusEvent(e)
			{
			signupWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
			
		signupWindow.addEventListener('focus', focusEvent);
		
		signupWindow.open();
		});
		
	mainContainer.add(createAcctBtn);
	
	/*
	 * Add the containers to the window
	 * We define them above so they can be referenced prior to being added to the window
	 */
	win.add(mainContainer);
	win.add(notificationView);
	
	return win;
	};

module.exports = DelegateWindow;