/**
 * Opened from the delegate window
 * This window contains the data collection for creating an account
 */
function SignupWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	var VerifyNumWindow = require('whateverapp/ui/VerifyNumWindow');
	var DelegateWindow = require('whateverapp/ui/DelegateWindow');
	var stringUtil = require('whateverapp/util/StringUtil');
	
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
		layout: 'vertical',
		zIndex: 1
		});
	
	var notificationView = require('whateverapp/ui/common/NotificationView').create();
	
	var navigationView = Ti.UI.createView({
		width: '100%',
		height: 44,
		top: 0
		});

	var backBtn = Ti.UI.createButton({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : 'black',
		backgroundColor : 'white',
		left: 10,
		width: 30,
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
	
	navigationView.add(backBtn);

	mainContainer.add(navigationView);
	
	var scrollView = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		top: 0, bottom: 0,
		width: '100%',
		layout: 'vertical'
		});
		
	mainContainer.add(scrollView);
	
	var createAccountDetailsView = Ti.UI.createView({
		backgroundColor: 'transparent',
		border: 0,
		borderColor: 'transparent',
		left: 0, 
		top: '10%',
		height: Ti.UI.SIZE,
		layout: 'vertical'
		});
	
	scrollView.add(createAccountDetailsView);

	// ADD COMPONENTS TO THE MAIN CONTAINER
	var firstName = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top: 5,
		left : 5, right: 5,
		width : Ti.UI.FILL,
		height : 50,
		hintText : L('input_hint_first'),
		isFocused : true,
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		autocorrect: false
		});
	
	firstName.addEventListener('return', function(e)
		{
		lastName.focus();
		});
	
	createAccountDetailsView.add(firstName);
	
	var lastName = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top: 5,
		left : 5, right: 5,
		width : Ti.UI.FILL,
		height : 50,
		hintText : L('input_hint_last'),
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		autocorrect: false
		});
	
	lastName.addEventListener('return', function(e)
		{
		username.focus();
		});
		
	createAccountDetailsView.add(lastName);
	
	var username = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top: 5,
		left : 5, right: 5,
		width : Ti.UI.FILL,
		height : 50,
		hintText : L('input_hint_username'),
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		autocorrect: false
		});
	
	username.addEventListener('return', function(e)
		{
		password.focus();
		});
	
	createAccountDetailsView.add(username);

	var password = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top: 5,
		left : 5, right: 5,
		width : Ti.UI.FILL,
		height : 50,
		hintText : L('input_hint_pass'),
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		passwordMask:true
		});
	
	password.addEventListener('return', function(e)
		{
		passwordCheck.focus();
		});
	
	createAccountDetailsView.add(password);
	
	var passwordCheck = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#336699',
		backgroundColor : 'white',
		borderColor : 'white',
		top: 5,
		left : 5, right: 5,
		width : Ti.UI.FILL,
		height : 50,
		hintText : L('input_hint_pass_check'),
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		passwordMask:true
		});
	
	passwordCheck.addEventListener('return', function(e)
		{
		var validData = validateInput();
		
		if(validData.doesPass)
			{
			createAccount(stringUtil.trim(username.value), password.value);
			}
		else
			{
			alert(validData.responseInfo);
			}
		});
		
	createAccountDetailsView.add(passwordCheck);

	/*
	 * Validates the input of the user
	 * Checks Password, Username, First Name, Last Name
	 * If invalid, returns false
	 * If valid, returns true
	 */
	function validateInput()
		{
		var validData = {
			doesPass : true,
			responseInfo : "Not valid input"
			}
		
		var userName = stringUtil.trim(username.value);
		
		if(userName.length == 0)
			{
			validData.doesPass = false;
			validData.responseInfo = L('invalid_user_empty');
			}
		else if(userName.length > 0 && userName.length < 4)
			{
			validData.doesPass = false;
			validData.responseInfo = L('invalid_user_size');
			}
		else if(userName.length >= 4)
			{
			if(!stringUtil.validUsername(userName))
				{
				validData.doesPass = false;
				validData.responseInfo = L('invalid_user_error');
				}			
			}
		
		if(validData.doesPass)
			{
			var firstname = stringUtil.trim(firstName.value);
			
			if(firstname.length == 0)
				{
				validData.doesPass = false;	
				validData.responseInfo = L('invalid_first_empty');
				}
			else
				{
				if(!stringUtil.validName(firstname))
					{
					validData.doesPass = false;
					validData.responseInfo = L('invalid_first_error');
					}
				}
			}
		
		if(validData.doesPass)
			{
			var lastname = stringUtil.trim(lastName.value);
			
			if(lastname.length == 0)
				{
				validData.doesPass = false;
				validData.responseInfo = L('invalid_last_empty');
				}
			else
				{
				if(!stringUtil.validName(lastname))
					{
					validData.doesPass = false;
					validData.responseInfo = L('invalid_last_error');
					}
				}
			}
		
		if(validData.doesPass)
			{
			var pass = stringUtil.trim(password.value);
				
			if(pass.length == 0)
				{
				validData.doesPass = false;
				validData.responseInfo = L('invalid_pass_empty');
				}
			else if(pass.length > 0 && pass.length < 8)
				{
				validData.doesPass = false;
				validData.responseInfo = L('invalid_pass_size');
				}
			else if(pass.length >= 8)
				{
				if(stringUtil.validPassword(pass))
					{
					var passCheck = stringUtil.trim(passwordCheck.value);
					
					if(pass != passCheck)
						{
						validData.doesPass = false;
						validData.responseInfo = L('invalid_pass_check');
						}
					} 
				else
					{
					validData.doesPass = false;
					validData.responseInfo = L('invalid_pass_error');
					}
				}
			}
			
		return validData;
		}

	/*
	 * Create Account Function, Called after the user enters in username and password and hits
	 * the return key
	 */
	function createAccount(username, password)
		{
		//TODO: Create removeEventListener for Sign-Up Button Here ie. createAccountButton.removeEventListener('click', createAccountEvent);
		Ti.API.info("Creating Account for user: " + username + "\n Password: " + password);
		
		var verifyNumWindow = new VerifyNumWindow();
		
		function focusEvent(e)
			{
			verifyNumWindow.removeEventListener('focus', focusEvent);
			win.close();
			};
		
		verifyNumWindow.addEventListener('focus', focusEvent);
		
		verifyNumWindow.open();
		}

	/*
	 * Add the containers to the window
	 * We define them above so they can be referenced prior to being added to the window
	 */
	win.add(mainContainer);
	win.add(notificationView);

	return win;
	};

module.exports = SignupWindow; 