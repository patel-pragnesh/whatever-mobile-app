/**
 * Opened from the delegate window
 * This window contains the login functionality
 */
function LoginWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	var MainWindow = require('whateverapp/ui/MainWindow');
	var DelegateWindow = require('whateverapp/ui/DelegateWindow');

	/*
	 * The main window
	 */
	var win = Ti.UI.createWindow({
		backgroundColor : '#333333',
		height : '100%',
		width : '100%',
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

	var backBtn = Ti.UI.createButton({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : 'black',
		backgroundColor : 'white',
		top : '2%',
		left : '2%',
		width : '10%',
		height : '5%',
		title : '<-',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0,
		borderColor:'white'
		});
		
	backBtn.addEventListener('click', function(e)
		{
		var delegateWindow = new DelegateWindow();
		
		function focusEvent(e)
			{
			delegateWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
			
		delegateWindow.addEventListener('focus', focusEvent);
		
		delegateWindow.open();
		});

	mainContainer.add(backBtn);

	// ADD COMPONENTS TO THE MAIN CONTAINER
	var username = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top : '10%',
		left : '2%',
		width : '96%',
		height : '10%',
		hintText : L('input_hint_username'),
		isFocused : true,
		returnKeyType: Ti.UI.RETURNKEY_NEXT
		});
		
	username.focus();
	
	username.addEventListener('return', function(e)
		{
		password.focus();
		});
		
	mainContainer.add(username);

	var password = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top : '22%',
		left : '2%',
		width : '96%',
		height : '10%',
		hintText : L('input_hint_pass'),
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		passwordMask:true
		});
		
	password.addEventListener('return', function(e)
		{
		login(username.value, password.value);
		});
		
	mainContainer.add(password);

	/*
	 * Login Function, Called after the user enters in username and password and hits
	 * the return key
	 */
	function login(username, password)
		{
		Ti.API.info("Logging In " + username + "\n Password: " + password);
		
		var mainWindow = new MainWindow();
		
		function focusEvent(e)
			{
			mainWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
			
		mainWindow.addEventListener('focus', focusEvent);
			
		mainWindow.open();
		};

	/*
	 * Add the containers to the window
	 * We define them above so they can be referenced prior to being added to the window
	 */
	win.add(mainContainer);
	
	return win;
	};

module.exports = LoginWindow; 