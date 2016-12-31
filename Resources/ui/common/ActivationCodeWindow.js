function ActivationCodeWindow(phoneNumber, sessionId)
	{
	var config = require('config');
	var _ = require('lib/Underscore');
	
	var httpClient = require('lib/HttpClient');
	
	var ActivateWindow = require('ui/common/ActivateWindow');
	var AccountWindow = require('ui/common/AccountWindow');
	var MainWindow = require('ui/common/MainWindow');
	
	var windowWidth = null;
	var purple = config.purple;
	
	var win = Ti.UI.createWindow({
		backgroundColor: purple,
		width: '100%',
		fullscreen: false,
		orientationModes: [Ti.UI.PORTRAIT]
		});

	if(config.platform === config.platform_android) {
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
	var windowPostLayoutCallback = function(e) {
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		
		if(config.platform === config.platform_android) {
			windowWidth = windowWidth * Ti.Platform.displayCaps.dpi / 160;
			}
		else {
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
	
	//create top nav view to hold logo and user profile 
	var topNavView = Ti.UI.createView
	({
		top: 20,
		height: '7.2%',
		width: '100%',	
	});
		

	//Add Whatever label upper-left  
    
    var labelView = Ti.UI.createImageView({
		height: '60.41%',
		width: '29.06%',
		top: 7,
		left: 12,
		image: "/images/whateverlabel",
		backgroundColor: purple,
		zIndex: 2
	});	
	
	topNavView.add(labelView);
	mainContainerView.add(topNavView);
	
	
	labelView.addEventListener('postlayout', function(e) 
		{
			labelHeight = labelView.size.height;
			labelWidth = labelView.size.width;
		});
		
	
	var activationViewContainer = Ti.UI.createView({
		height: 120,
		top: 0,
		width: '100%'
		});
		
	var codesView = Ti.UI.createView({
		height: 90,
		top: 15,
		left: 10,
		right: 15,
		width: Ti.UI.FILL,
		layout: 'horizontal'
		});
	
	var defaultFieldColor = '#1763A6';
	var codeError = false;
	var codeLabels = [];
	
	// Hidden text field
	var codeTextField = Ti.UI.createTextField({
		width: 0,
		left: 0,
		maxLength: 4,
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
		autocorrect: false
		});
		
	if(config.platform === config.platform_android)
		{
		codeTextField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
	
	codesView.add(codeTextField);
		
	var codeOneViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '25%',
		left: 0
		});
		
	var defaultCodeView = {
		backgroundColor: 'white',
		height: 90,
		width: '100%',
		left: 5
		};
		
	var defaultCodeLabel = {
		color: defaultFieldColor,
		font:
			{
			fontSize: 48,
			fontFamily: config.opensans_regular
			}
		};
		
	var codeOneView = Ti.UI.createView(defaultCodeView);
	var codeOneLabel = Ti.UI.createLabel(defaultCodeLabel);
	codeLabels.push(codeOneLabel);
	
	codeOneView.add(codeOneLabel);
	codeOneViewContainer.add(codeOneView);
	codesView.add(codeOneViewContainer);
	
	var codeTwoViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '25%',
		left: 0
		});
		
	var codeTwoView = Ti.UI.createView(defaultCodeView);
	var codeTwoLabel = Ti.UI.createLabel(defaultCodeLabel);
	codeLabels.push(codeTwoLabel);
	
	codeTwoView.add(codeTwoLabel);
	codeTwoViewContainer.add(codeTwoView);
	codesView.add(codeTwoViewContainer);
	
	var codeThreeViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '25%',
		left: 0
		});
		
	var codeThreeView = Ti.UI.createView(defaultCodeView);
	var codeThreeLabel = Ti.UI.createLabel(defaultCodeLabel);
	codeLabels.push(codeThreeLabel);
	
	codeThreeView.add(codeThreeLabel);
	codeThreeViewContainer.add(codeThreeView);
	codesView.add(codeThreeViewContainer);
	
	var codeFourViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '24%',
		left: 0
		});
		
	var codeFourView = Ti.UI.createView(defaultCodeView);
	var codeFourLabel = Ti.UI.createLabel(defaultCodeLabel);
	codeLabels.push(codeFourLabel);
	
	codeFourView.add(codeFourLabel);
	codeFourViewContainer.add(codeFourView);
	codesView.add(codeFourViewContainer);
	
	activationViewContainer.add(codesView);
	
	//TODO  fix bug: clear codeViews after wrong entry or didn't recieve code click
	
	// The handler for clicking the code view container - focuses the text field and produces a keyboard
	var codesViewClickEventHandler = function(e)
		{
		codeTextField.focus();
		};
		
	codesView.addEventListener('click', codesViewClickEventHandler);
	
	var actionsView = Ti.UI.createView(
		{
		height: 45,
		top: 105,
		left: 15,
		right: 15,
		opacity: 0,
		layout: 'horizontal'
		});
		
	var receiveCodeLabel = Ti.UI.createLabel({
		color: 'white',
		left: 0,
		font:
			{
			fontSize: 15,
			fontFamily: config.opensans_light
			},
		text: L('didnt_receive_code')
		});
		
	actionsView.add(receiveCodeLabel);
	
	var callMeButton = createActionButton({
		title: L('call_me'),
		left: 15
		});
		
	actionsView.add(callMeButton);
	
	/*
	 * Create a confirmation dialog to show the users number
	 * and confirm it is accurate - returns the index of the button clicked
	 * in the callback method
	 */
	function createConfirmDialog(callback)
		{
		var confirmDialog = Ti.UI.createAlertDialog({
			title: String.format(L('confirm_phone_number'), phoneNumber),
			buttonNames: [L('change'), L('yes')]
			});
			
		confirmDialog.addEventListener('click', function(e)
			{
			callback(e.index);
			});
			
		confirmDialog.show();
		}
	
	/*
	 * Called when change is pressed from the confirmation dialog
	 * Closes this window and returns to the first window requiring a phone number
	 */
	function changePhoneNumber()
		{
		var activateWindow = new ActivateWindow();
						
		function activateWindowFocusEvent()
			{
			activateWindow.removeEventListener('focus', activateWindowFocusEvent);
			win.close();
			};
				
		activateWindow.addEventListener('focus', activateWindowFocusEvent);
		activateWindow.open();
		}
	
	/*
	 * Hides the actions view - the one with the call me and resend buttons
	 * Animated with a callback containing a boolean when completed
	 */
	function hideActionsView(callback)
		{
		actionsView.animate({opacity: 0, duration: 400}, function(e)
			{
			if(config.platform === config.platform_android)
				{
				activationViewContainer.height = 120;
				callback(true);
				}
			else
				{
				activationViewContainer.animate({height: 120, duration: 300}, function(e)
					{
					callback(true);
					});
				}
			});
		}
		
	function resendActivationCode()
		{
		notificationView.showIndicator();
		
		var request = {};
		request.language = Ti.Locale.getCurrentLanguage();
		request.country = Ti.Locale.getCurrentCountry();
		request.phone_number = phoneNumber;
		
		Ti.API.info(JSON.stringify(request));
		
		httpClient.doPost('/v1/activate', request, function(success, response)
			{
			Ti.API.info(response);
			
			notificationView.hideIndicator();
			
			if(success)
				{
				// Set the new session id
				sessionId = response.session;
				}
			else
				{
				var dialog = Ti.UI.createAlertDialog({
					message: String.format(L('general_server_error'), phoneNumber),
					ok: L('okay')
					});
					
				dialog.addEventListener('click', function(e)
					{
					win.setActionsTimer(3000);
					});
					
				dialog.show();
				}
			});
		}
	
	/*
	 * Event handler for when the resend button is clicked
	 */
	function resendButtonClick()
		{
		codeTextField.blur();
		callMeButton.removeEventListener('click', callMeButtonClick);
		resendButton.removeEventListener('click', resendButtonClick);
		
		hideActionsView(function(hidden)
			{
			if(hidden)
				{
				createConfirmDialog(function(index)
					{
					if(index == 1)
						{
						resendActivationCode();
						}
					else
						{
						changePhoneNumber();
						}
					});
				}
			});
		}
	
	/*
	 * Event handler for when the call me button is clicked
	 */
	function callMeButtonClick()
		{
		codeTextField.blur();
		callMeButton.removeEventListener('click', callMeButtonClick);
		resendButton.removeEventListener('click', resendButtonClick);
		
		hideActionsView(function(hidden)
			{
			if(hidden)
				{
				createConfirmDialog(function(index)
					{
					if(index == 1)
						{
						notificationView.showIndicator();
						
						var request = {};
						request.type = "voice",
						request.app_id = config.app_key;
						request.locale = Ti.Locale.getCurrentLocale();
						request.phone_number = phoneNumber;
						request.message = L('verification_code_voice_message');
						
						var envelope = {};
						envelope.nexmo = request;
			
						httpClient.doPost(config.auth_endpoint, envelope, function(success, response)
							{
							if(success)
								{
								
								notificationView.hideIndicator();
								
								win.setActionsTimer(30000);
								}
							else
								{
								notificationView.hideIndicator();
								
								var dialog = Ti.UI.createAlertDialog({
									message: String.format(L('general_server_error'), phoneNumber),
									ok: L('okay')
									});
									
								dialog.addEventListener('click', function(e)
									{
									win.setActionsTimer(3000);
									});
									
								dialog.show();
								}
							});
						}
					else
						{
						changePhoneNumber();
						}
					});
				}
			});
		}
	
	callMeButton.addEventListener('click', callMeButtonClick);
	
	var resendButton = createActionButton({
		title: L('resend_code'),
		left: 15
		});
	
	actionsView.add(resendButton);
	
	resendButton.addEventListener('click', resendButtonClick);
		
	activationViewContainer.add(actionsView);
	
	/*
	 * A utility function that creates a button that looks like
	 * plain text but contains button like features when clicked
	 * Used to create the call me and resend buttons
	 */
	function createActionButton(parameters)
		{
		var actionButton = Ti.UI.createButton({
		    title: parameters.title,
		    color: 'white',                        
		    backgroundImage: null,
		    backgroundSelectedImage: null,
			backgroundDisabledImage: null,
			font:
				{
				fontSize: 15,
				fontFamily: config.opensans_semibold
				},
		    width: Ti.UI.SIZE,
		    height: 45
		    });
		
		if(parameters.left)
			{
			actionButton.left = parameters.left;
			actionButton.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
			}
			
		if(parameters.right)
			{
			actionButton.right = parameters.right;
			actionButton.textAlign = Ti.UI.TEXT_ALIGNMENT_RIGHT;
			}
		    
		if(config.platform === config.platform_iphone)
			{
			actionButton.selectedColor = '#7791a7';
			}
		else
			{
			actionButton.backgroundSelectedColor = '#cbd5de';
			}
		
		return actionButton;
		};
	
	/*
	 * Strip and clean any values that are not numbers from the input
	 */
	function cleanCodeValue(value)
		{
		value = value.replace(/[^\d.]/g, '');
		return value;
		}
	
	/*
	 * Called when we have 4 digits entered into the text field
	 * If there is a match then we will move on
	 */
	function verifyCode(currentValue)
		{
		var request = {};
		request.language = Ti.Locale.getCurrentLanguage();
		request.country = Ti.Locale.getCurrentCountry();
		request.phone_number = phoneNumber;
		request.activation_code = codeTextField.value;
		
		Ti.API.info(JSON.stringify(request));
		
		var endpoint = '/v1/validatecode;jsessionid=' + sessionId;
		
		httpClient.doPost(endpoint, request, function(success, response)
			{
			notificationView.showIndicator();

			//Ti.API.info(response);
			
			if(success)
				{
				codesView.removeEventListener('click', codesViewClickEventHandler);
				clearTimeout(animateActions);
				codeTextField.blur();
				codeTextField.setEditable(false);
				
				hideActionsView(function(hidden)
					{
					if(hidden)
						{
						activationViewContainer.remove(actionsView);
						}
					});
				
				for(var i = 0; i < codeLabels.length; i++)
					{
					codeLabels[i].color = '#049900';
					}
				
				var account = {};
				account.id = response.user.id;
				
				if(response.new_user)
					{
					// Set the incomplete account
					Ti.App.Properties.setObject("account", account);
					
					var accountWindow = new AccountWindow(phoneNumber);
					
					function accountWindowFocusEvent()
						{
						accountWindow.removeEventListener('focus', accountWindowFocusEvent);
						win.close();
						};
							
					accountWindow.addEventListener('focus', accountWindowFocusEvent);
					
					notificationView.hideIndicator();
					
					accountWindow.open();
					}
				else
					{
					Ti.API.info('setting account');
					account.first_name = response.user.first_name;
					account.last_name = response.user.last_name;
					account.blockList = response.user.blockedUsers;
					
					Ti.App.Properties.setObject("account", account);
					Ti.API.info('opening mainWindow');
					var mainWindow = new MainWindow();
					
					function mainWindowFocusEvent()
						{
						mainWindow.removeEventListener('focus', mainWindowFocusEvent);
						win.close();
						};
							
					mainWindow.addEventListener('focus', mainWindowFocusEvent);
					
					notificationView.hideIndicator();
					
					mainWindow.open();
					}
				}
			else
				{
				notificationView.hideIndicator();
				
				if(response.error == 'invalid_session')
					{
					var dialog = Ti.UI.createAlertDialog({
						message: String.format(L('invalid_session'), phoneNumber),
						ok: L('okay')
						});
						
					dialog.addEventListener('click', function(e)
						{
						resendActivationCode();
						});
						
					dialog.show();
					}
				else if(response.error == 'invalid_code')
					{
					for(var i = 0; i < codeLabels.length; i++)
						{
						codeLabels[i].color = '#b00000';
						}
						
					codeError = true;
					Ti.Media.vibrate();
					}
				else
					{
					var dialog = Ti.UI.createAlertDialog({
					message: String.format(L('general_server_error'), phoneNumber),
					ok: L('okay')
					}).show();
					}
				}
			});
		}
	
	/*
	 * The listener for the hidden text field
	 * Updates the labels in the code views 
	 */
	codeTextField.addEventListener('change', function(e)
		{
		var currentValue = cleanCodeValue(this.value);
		
		if(currentValue.length == 3 && codeError)
			{
			currentValue = this.value = '';
			
			for(var i = 0; i < codeLabels.length; i++)
				{
				codeLabels[i].color = defaultFieldColor;
				}
		
			codeError = false;
			}
		
		if(currentValue.length == 4)
			{
			verifyCode(currentValue);
			}
			
		if(currentValue.length == 5)
			{
			this.value = currentValue.substring(0,4);
			}
		
		codeOneLabel.text = currentValue.substring(0,1);
		codeTwoLabel.text = currentValue.substring(1,2);
		codeThreeLabel.text = currentValue.substring(2,3);
		codeFourLabel.text = currentValue.substring(3,4);
		});
		
	mainContainerView.add(activationViewContainer);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	/*
	 * Called when the window is opened and whenever we have a successful resend or call me action
	 * Animates the view for the actions after a set period of time
	 * This is so those buttons only appear after someone has not made it past the code enter
	 * Or possibly not recieved their code
	 */
	var animateActions;
	
	win.setActionsTimer = function(time)
		{
		animateActions = setTimeout(function()
			{
			if(config.platform === config.platform_android)
				{
				activationViewContainer.height = 150;
				
				actionsView.animate({opacity: 1, duration: 600}, function(e)
					{
					clearTimeout(animateActions);
					});
				}
			else
				{
				activationViewContainer.animate({height: 150, duration: 400}, function(e)
					{
					actionsView.animate({opacity: 1, duration: 400}, function(e)
						{
						clearTimeout(animateActions);
						});
					});
				}
				
			callMeButton.addEventListener('click', callMeButtonClick);
			resendButton.addEventListener('click', resendButtonClick);
			}, time);
		};
	
	return win;
	};

module.exports = ActivationCodeWindow;