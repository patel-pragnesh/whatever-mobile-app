function AccountWindow(verificationCode, phoneNumber)
	{
	var config = require('config');
	var _ = require('lib/Underscore');
	
	var httpClient = require('lib/HttpClient');
	var MainWindow = require('ui/common/MainWindow');
	
	var windowWidth = null;
	
	var win = Ti.UI.createWindow({
		backgroundColor: '#f5f5f5',
		width: '100%',
		fullscreen: false,
		orientationModes: [Ti.UI.PORTRAIT]
		});

	if(config.platform === config.platform_android)
		{
		win.navBarHidden = true;
		win.height = '100%';
		}
	else
		{
		if(config.major >= 7)
			{
			win.top = 20;
			win.bottom = 0;
			}
		}
	
	/*
	 * Called after the UI elements are created
	 */
	var windowPostLayoutCallback = function(e)
		{
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		
		if(config.platform === config.platform_android)
			{
			windowWidth = windowWidth * Ti.Platform.displayCaps.dpi / 160;
			}
		else
			{
			windowWidth = win.size.width;
			}
		};
	
	win.addEventListener('postlayout', windowPostLayoutCallback);
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('ui/common/NotificationView').create();
	
	var mainContainerView = Ti.UI.createView({
		width: '100%',
		height: '100%',
		layout: 'vertical',
		zIndex: 1
		});
	
	var headerView = Ti.UI.createView({
		height: 80,
		top: 0,
		width: '100%'
		});
		
	mainContainerView.add(headerView);
	
	var accountViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: 0,
		width: '100%',
		layout: 'vertical'
		});
		
	var defaultTextField = {
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		backgroundColor: 'white',
		font:
			{
			fontSize: 20,
			fontFamily: config.opensans_light
			},
		color: '#1763A6',
		left: 15,
		right: 15,
		height: 45,
		paddingLeft: 5,
		paddingRight: 5,
		autocorrect: false
		};
		
	var firstNameTextField = Ti.UI.createTextField(defaultTextField);
	firstNameTextField.hintText = L('first_name');
	firstNameTextField.top = 0;
	
	accountViewContainer.add(firstNameTextField);
	
	var lastNameTextField = Ti.UI.createTextField(defaultTextField);
	lastNameTextField.hintText = L('last_name');
	lastNameTextField.top = 10;
	
	accountViewContainer.add(lastNameTextField);
	
	var continueButton = Ti.UI.createButton({
		backgroundColor: '#F2AE30',
		borderColor: '#F2AE30',
		borderWidth: 1,
		color: 'white',
		font:
			{
			fontSize: 18,
			fontFamily: config.opensans_light
			},
		title: L('create_account'),
		height: 45,
		top: 10,
		left: 15,
		right: 15,
		error: false
		});
		
	if(config.platform === config.platform_android)
		{
		continueButton.backgroundSelectedColor = '#d9971d';
		}
		
	accountViewContainer.add(continueButton);
	
	function continueButtonHandler()
		{
		continueButton.removeEventListener('click', continueButtonHandler);
		
		var createAccount = true;
		
		if(firstNameTextField.value.trim().length == 0)
			{
			createAccount = false;
			alert(L('first_name_required'));
			}
			
		if(lastNameTextField.value.trim().length == 0)
			{
			createAccount = false;
			alert(L('last_name_required'));
			}
		
		if(createAccount)
			{
			notificationView.showIndicator();
			
			var account = Ti.App.Properties.getObject("account");
			
			Ti.API.info(JSON.stringify(account));
			
			var request = {};
			request.language = Ti.Locale.getCurrentLanguage();
			request.country = Ti.Locale.getCurrentCountry();
			request.id = account.id;
			request.first_name = firstNameTextField.value;
			request.last_name = lastNameTextField.value;
			
			Ti.API.info(JSON.stringify(request));
			
			httpClient.doPost('/v1/createaccount', request, function(success, response)
				{
				if(success)
					{
					notificationView.hideIndicator();
					
					Ti.API.info(JSON.stringify(response));
					
					// Update the account object
					account.first_name = firstNameTextField.value.trim();
					account.last_name = lastNameTextField.value.trim();
			
					Ti.App.Properties.setObject("account", account);
					
					var mainWindow = new MainWindow();
						
					function mainWindowFocusEvent()
						{
						mainWindow.removeEventListener('focus', mainWindowFocusEvent);
						win.close();
						};
							
					mainWindow.addEventListener('focus', mainWindowFocusEvent);
					mainWindow.open();
					}
				else
					{
					notificationView.hideIndicator();
					
					if(response.error)
						{
						if(response.error == 'invalid_request')
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('invalid_phone_number'), phoneNumber),
							ok: L('okay')
							}).show();
							}
						else if(response.error == 'missing_account')
							{
							// TODO If we have a missing account we need to wipe out the account and make them start over
							// Not sure if this is the proper contingency
							}
						else
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('general_server_error'), phoneNumber),
							ok: L('okay')
							}).show();
							}
						}
						
					continueButton.addEventListener('click', continueButtonHandler);
					}
				});
			}
		else
			{
			continueButton.addEventListener('click', continueButtonHandler);
			}
		}
		
	continueButton.addEventListener('click', continueButtonHandler);
	
	mainContainerView.add(accountViewContainer);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	return win;
	};

module.exports = AccountWindow;