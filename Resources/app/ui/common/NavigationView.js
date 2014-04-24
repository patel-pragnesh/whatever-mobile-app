/**
 * The default navigation view
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args, trayView, parent)
	{
	var config = require('app/config');
	
	var view = Ti.UI.createView({
		height: Ti.UI.SIZE,
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
		
	var trayButtonView = Ti.UI.createView({
		left: 10,
		height: 50,
		width: 50,
		closed: true
		});
		
	var trayButtonImage = Ti.UI.createImageView({
  		image: '/images/list.png',
  		left: 0,
  		width: 28,
  		height: 22
		});
		
	trayButtonView.add(trayButtonImage);
		
	var animateDuration = 400;
	
	// Set the animation speed - it is slower on Android for some reason
	if(config.platform === 'android')
		{
		animateDuration = 200;
		}
		
	function closeTray()
		{
		trayView.reset();
		parent.removeEventListener('touchmove', parentTouchListener);
		parent.animate({left: 0, duration: animateDuration});
		trayButtonView.closed = true;
		}
	
	// Listen for the touch on the parent
	function parentTouchListener()
		{
		closeTray();
		}
		
	navigationView.toggleTray = function()
		{
		if(trayButtonView.closed)
			{
			parent.animate({left: '85%', duration: 400}, function()
				{
				parent.addEventListener('touchmove', parentTouchListener);
				trayButtonView.closed = false;
				});
			}
		else
			{
			closeTray();
			}
		};
		
	trayButtonView.addEventListener('click', navigationView.toggleTray);
		
	navigationView.add(trayButtonView);
	
	view.add(navigationView);
	
	var decoratorView = Ti.UI.createView({
		backgroundColor: '#c8c8c8',
		height: 1,
		width: '100%'
		});
		
	view.add(decoratorView);
		
	return view;
	};