/**
 * The tray view holds the functional menus for the app
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args)
	{
	var config = require('app/config');
	
	var account = Ti.App.Properties.getObject("account");
	
	var view = Ti.UI.createView({
		backgroundColor: args.backgroundColor,
		height: '100%',
		width: '85%',
		top: 0,
		left: 0,
		layout: 'vertical'
		});
		
	if(config.platform === 'iphone' && config.major >= 7)
		{
		var statusBarView = Ti.UI.createView({
			backgroundColor: args.backgroundColor,
			height: 20,
			width: '100%'
			});
			
		view.add(statusBarView);
		}
	
	var accountView = Ti.UI.createView({
		height: 50,
		width: '100%',
		top: 0,
		left: 0
		});
	
	// TODO Add default image + actual image from URL
	var profileImage = Ti.UI.createImageView({
  		image: '/app/dev/image/profile.png',
  		top: 10,
  		left: 10,
  		width: 30,
  		height: 30
		});
		
	accountView.add(profileImage);
	
	var userNameLabel = Ti.UI.createLabel({
		color: '#e3e3e3',
		font:
			{
			fontSize: 14,
			fontFamily: config.opensans_light
			},
		top: 10,
		left: 50,
		height: 30,
		width: '70%',
		textAlign: 'left',
		text: account.first_name + ' ' + account.last_name
		});
	
	// No wrap with ellipsize if name is too long
	if(config.platform === config.platform_android)
		{
		userNameLabel.wordWrap = false;
		userNameLabel.ellipsize = true;
		}
	else
		{
		userNameLabel.minimumFontSize = 14;
		}
		
	accountView.add(userNameLabel);
	
	var gearImage = Ti.UI.createImageView({
  		image: '/images/gear.png',
  		top: 16,
  		right: 10,
  		width: 18,
  		height: 18
		});
		
	accountView.add(gearImage);
		
	view.add(accountView);
	
	// Add a separator
	view.add(createSeparator());
	
	function createSeparator()
		{
		var separatorView = Ti.UI.createView({
			backgroundColor: '#8e8e8e',
			height: 1,
			width: '100%',
			top: 0,
			left: 0
			});
		
		return separatorView;
		}
	
	return view;
	};