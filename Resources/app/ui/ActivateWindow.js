function ActivateWindow()
	{
	var config = require('app/config');
	var _ = require('lib/underscore');
	var countryCodeUtil = require('app/util/countrycodeutil');
	var httpClient = require('lib/httpclient');
	
	var ActivationCodeWindow = require('app/ui/ActivationCodeWindow');
	
	var windowWidth = null;
	var deviceCountryCode = countryCodeUtil.getDeviceCode();
	
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
	
	var notificationView = require('app/ui/common/NotificationView').create();
	
	var mainContainerView = Ti.UI.createView({
		width: '100%',
		height: '100%',
		layout: 'vertical',
		zIndex: 1
		});
	
	var headerView = Ti.UI.createView({
		backgroundColor: 'white',
		height: 105,
		top: 0,
		width: '100%'
		});
		
	mainContainerView.add(headerView);
	
	var activationViewContainer = Ti.UI.createView({
		height: 135,
		top: 0,
		width: '100%',
		layout: 'vertical'
		});
		
	var phoneNumberView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: 15,
		width: '100%',
		layout: 'horizontal'
		});
		
	var countryCodeViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '28%',
		left: 0
		});
		
	var countryCodeView = Ti.UI.createView({
		backgroundColor: 'white',
		height: 45,
		left: 15,
		right: 0
		});
		
	var viewTitleLabel = Ti.UI.createLabel({
		color: '#1763A6',
		font:
			{
			fontSize: 20,
			fontFamily: config.opensans_semibold
			},
		text: '+' + deviceCountryCode
		});
		
	countryCodeView.add(viewTitleLabel);
		
	countryCodeViewContainer.add(countryCodeView);
		
	phoneNumberView.add(countryCodeViewContainer);
	
	var phoneNumberFieldView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: '72%',
		left: 0
		});
	
	var phoneNumberField = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		backgroundColor: 'white',
		borderColor: 'white',
		font:
			{
			fontSize: 20,
			fontFamily: config.opensans_light
			},
		color: '#1763A6',
		hintText: L('phone_number_label'),
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
		left: 5,
		right: 15,
		height: 45,
		paddingLeft: 5,
		paddingRight: 5,
		autocorrect: false
		});
		
	if(config.platform === config.platform_android)
		{
		phoneNumberField.backgroundFocusedColor = 'white';
		phoneNumberField.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM;
		phoneNumberField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		
	countryCodeView.addEventListener('click', function(e){
		phoneNumberField.value = '';
		phoneNumberField.blur();
		});
		
	phoneNumberFieldView.add(phoneNumberField);
		
	phoneNumberView.add(phoneNumberFieldView);
	
	activationViewContainer.add(phoneNumberView);
	
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
		title: L('continue_button'),
		height: 45,
		top: 15,
		left: 15,
		right: 15,
		error: false
		});
		
	if(config.platform === config.platform_android)
		{
		continueButton.backgroundSelectedColor = '#d9971d';
		}
		
	phoneNumberField.addEventListener('focus', function(e)
		{
		if(continueButton.error)
			{
			phoneNumberField.borderColor = 'white';
			continueButton.error = false;
			}
		});
		
	function continueButtonHandler()
		{
		continueButton.removeEventListener('click', continueButtonHandler);
		phoneNumberField.blur();
		
		if(phoneNumberField.value.replace(/[^\d.]/g, "").length === 0)
			{
			phoneNumberField.value = '';
			phoneNumberField.borderColor = '#b00000';
			continueButton.error = true;
			
			continueButton.addEventListener('click', continueButtonHandler);
			}
		else
			{
			notificationView.showIndicator();
			
			// Cleanse the phone number
			var phoneNumber = deviceCountryCode + phoneNumberField.value.replace(/[^\d.]/g, "");
			
			var request = {};
			request.language = Ti.Locale.getCurrentLanguage();
			request.country = Ti.Locale.getCurrentCountry();
			request.phone_number = phoneNumber;
			
			Ti.API.info(JSON.stringify(request));
			
			httpClient.doPost('/v1/activate', request, function(success, response)
				{
				Ti.API.info(response);
				
				if(success)
					{
					var activationCodeWindow = new ActivationCodeWindow(phoneNumber, response.session);
							
					function activationCodeWindowFocusEvent()
						{
						activationCodeWindow.removeEventListener('focus', activationCodeWindowFocusEvent);
						activationCodeWindow.setActionsTimer(20000);
						win.close();
						};
							
					activationCodeWindow.addEventListener('focus', activationCodeWindowFocusEvent);
					
					notificationView.hideIndicator();
					
					activationCodeWindow.open();
					}
				else
					{
					notificationView.hideIndicator();
					
					var invalidNumber = false; // server side validation
					var serviceError = false; // number could not be reached by the service
					
					if(response.error)
						{
						if(response.error == 'invalid_phone_number')
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('invalid_phone_number'), phoneNumber),
							ok: L('okay')
							}).show();
							}
						else if(response.error == 'service_error')
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('activation_service_error'), phoneNumber),
							ok: L('okay')
							}).show();
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
		}
		
	continueButton.addEventListener('click', continueButtonHandler);
		
	activationViewContainer.add(continueButton);
		
	mainContainerView.add(activationViewContainer);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	return win;
	};

module.exports = ActivateWindow;