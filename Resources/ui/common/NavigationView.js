/**
 * The default navigation view
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args, parent)
	{
	var config = require('config');
	
	var view = Ti.UI.createView({
		width: '100%',
		top: 0,
		layout: 'vertical'
		});
	
	// Compensate for the iPhone status bar
	if(config.platform === 'iphone' && config.major >= 7)
		{
		var statusBarView = Ti.UI.createView({
			backgroundColor: args.backgroundColor,
			height: 20,
			width: '100%'
			});
			
		view.add(statusBarView);
		}
		
	var navigationView = Ti.UI.createView({
		backgroundColor: args.backgroundColor,
		height: 50,
		width: '100%'
		});
		
	var titleLabel = Ti.UI.createLabel({
		color: '#1763A6',
		font:
			{
			fontSize: 20,
			fontFamily: config.opensans_light
			},
		height: 50,
		textAlign: 'center',
		text: args.title
		});
	
	navigationView.add(titleLabel);
	
	var backButtonView = Ti.UI.createView({
		left: 10,
		height: 50,
		width: 50
		});
		
	var backButtonImage = Ti.UI.createImageView({
  		image: '/images/back-arrow.png',
  		left: 0,
  		width: 11,
  		height: 22
		});
		
	backButtonView.add(backButtonImage);
	
	function closeParentWindow()
		{
		parent.close();
		}
	
	backButtonView.addEventListener('click', closeParentWindow);
		
	navigationView.add(backButtonView);
	
	view.add(navigationView);
	
	var decoratorView = Ti.UI.createView({
		backgroundColor: '#221233',
		height: 1,
		width: '100%'
		});
		
	view.add(decoratorView);
		
	return view;
	};