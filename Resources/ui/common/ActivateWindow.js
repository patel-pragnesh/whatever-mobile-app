function ActivateWindow()
	{
	var config = require('config');
	var _ = require('lib/Underscore');
	
	
	var countryCodeUtil = require('app/util/countrycodeutil');
	
	var httpClient = require('lib/HttpClient');
	
	var ActivationCodeWindow = require('ui/common/ActivationCodeWindow');
	
	var windowWidth = null;
	var deviceCountryCode = countryCodeUtil.getDeviceCode();
	
	var purple = config.purple;
		
	var win = Ti.UI.createWindow({
		backgroundColor: purple,
		width: '100%',
		height: '100%',
		fullscreen: false,
		orientationModes: [Ti.UI.PORTRAIT],
		opacity: 0
		});

	if(config.platform === config.platform_android)
		{
		win.navBarHidden = true;
		win.height = '100%';
		}
	
	/*
	 * Called after the UI elements are created
	 */
	var countryPickerHeight = 0;
	
	var windowPostLayoutCallback = function(e)
		{
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		countryPickerHeight = countryPickerContainer.rect.height;
		countryPickerContainer.height = 0;
		
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
	
	var windowOpenCallback = function(e)
		{
		win.animate({opacity: 1, duration: 400});
		};
		
	win.addEventListener('open', windowOpenCallback);
	
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
	});	
	
	topNavView.add(labelView);
	mainContainerView.add(topNavView);
	
	
	labelView.addEventListener('postlayout', function(e) 
		{
			labelHeight = labelView.size.height;
			labelWidth = labelView.size.width;
		});
	
	
	var activationViewContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		top: '15%',
		width: '100%',
		layout: 'vertical',
		backgroundColor: purple
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
		color: 'black',
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
		color: 'black',
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
		
	phoneNumberFieldView.add(phoneNumberField);
	phoneNumberView.add(phoneNumberFieldView);
	activationViewContainer.add(phoneNumberView);
	
	var countryPickerContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		layout: 'vertical',
		visible: false
		});
		
	phoneNumberField.addEventListener('focus', function()
		{
		if(countryPickerContainer.height > 0)
			{
			countryPickerContainer.height = 0;
			countryPickerContainer.hide();
			}
		});
		
	countryCodeView.addEventListener('click', function(e){
		phoneNumberField.value = '';
		phoneNumberField.blur();
		
		// Show the picker
		if(countryPickerContainer.height == 0)
			{
			countryPickerContainer.height = countryPickerHeight;
			countryPickerContainer.show();
			}
		});
		
	var pickerContainerTopPadding = Ti.UI.createView({
		height: 15,
		width: Ti.UI.SIZE,
		top: 0
		});
		
	countryPickerContainer.add(pickerContainerTopPadding);
	
	var countryPicker = Titanium.UI.createPicker({
		top: 0,
		//height: Titanium.UI.SIZE,
		backgroundColor: '#f5f5f5',
		useSpinner: true
		});
		
	var data = [];
	
	// Build the picker data
	var countries = countryCodeUtil.getCountries();
	Ti.API.info('countries length = ' + countries.length);
	
	for(var c = 0; c < countries.length; c++)
		{
		data.push(Ti.UI.createPickerRow({title: countries[c].name, phoneCode: countries[c].phoneCode, code: countries[c].code}));
		}
	
	countryPicker.add(data);
	Ti.API.info('data length = ' + data.length);
	countryPicker.selectionIndicator = true;
	
	countryPicker.addEventListener('change', function(e)
		{
		deviceCountryCode = e.row.phoneCode;
		viewTitleLabel.text = '+' + deviceCountryCode;
		});
	
	countryPickerContainer.add(countryPicker);
	activationViewContainer.add(countryPickerContainer);
	
	var continueButton = Ti.UI.createButton({
		backgroundColor: '#f5f5f5',
		borderWidth: 0,
		color: purple,
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
		continueButton.backgroundColor = purple;
		continueButton.color = '#f5f5f5';
		if(phoneNumberField.value.replace(/[^\d.]/g, "").length === 0)
			{
			phoneNumberField.value = '';
			phoneNumberField.borderColor = '#b00000';
			continueButton.error = true;
			continueButton.backgroundColor = '#f5f5f5';
			continueButton.color = purple;
			
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
				//Ti.API.info(JSON.stringify(response));
				
				if(success)
					{
					var activationCodeWindow = new ActivationCodeWindow(phoneNumber, response.session);
							
					function activationCodeWindowFocusEvent()
						{
						activationCodeWindow.removeEventListener('focus', activationCodeWindowFocusEvent);
						activationCodeWindow.setActionsTimer(20000);
						//win.close();
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
							continueButton.backgroundColor = '#f5f5f5';
							continueButton.color = purple;
							}
						else if(response.error == 'service_error')
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('activation_service_error'), phoneNumber),
							ok: L('okay')
							}).show();
							continueButton.backgroundColor = '#f5f5f5';
							continueButton.color = purple;
							}
						else
							{
							var dialog = Ti.UI.createAlertDialog({
							message: String.format(L('general_server_error'), phoneNumber),
							ok: L('okay')
							}).show();
							continueButton.backgroundColor = '#f5f5f5';
							continueButton.color = purple;
							}
						}
						
					continueButton.addEventListener('click', continueButtonHandler);
					}
				});
			}
		}
		
	continueButton.addEventListener('click', continueButtonHandler);
		
	activationViewContainer.add(continueButton);
	
	var terms = Ti.UI.createLabel({
		top: 50,
		width: '90%',
		height: Ti.UI.SIZE,
		color: 'white',
		text: 'By creating an account, you agree to our',
		font: {fontFamily: config.avenir_next_regular,
				fontSize: 16}
	});
	activationViewContainer.add(terms);
	
	var conditionsString = 'Terms and Conditions';
	var attr = Ti.UI.createAttributedString({
		text: conditionsString,
		attributes: [
			{
				type: Titanium.UI.ATTRIBUTE_UNDERLINES_STYLE,
				value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
				range: [0, conditionsString.length]
			}
		]
	});
	
	var conditions = Ti.UI.createLabel({
		top: 5,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: 'white',
		attributedString: attr,
		font: {fontFamily: config.avenir_next_medium,
				fontSize: 18}
	});
		var TermsOfService = require('ui/common/TermsOfService');
		conditions.addEventListener('click', function(e){
			var termsOfService = new TermsOfService(win);
			
			win.add(termsOfService);
		});
	activationViewContainer.add(conditions);
		
	mainContainerView.add(activationViewContainer);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	return win;
	};

module.exports = ActivateWindow;