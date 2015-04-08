/**
 * The navigation view is designed to be a layer directly about the current window
 * It is added first to the window and has a higher zIndex. At 100% coverage HxW the view also allows
 * Any buttons or functionality below it to be unavailable to secondary clicks for example
 * 
 * We could slide in notifications on this view, implement custom alerts etc. Typical use is to show an indicator
 * while a process is taking longer in the background
 * 
 * @param {Object} args
 */
exports.create = function(args, callback)
	{
	var config = require('config');
	
	var view = Ti.UI.createView({
		height: '100%',
		width: '100%',
		visible: false,
		zIndex: 10
		});
	
	var indicatorVisible = false;
	var indicator;
	
	view.showIndicator = function()
		{
		indicator = Ti.UI.createActivityIndicator({
			borderRadius: 5,
			});
			
		if(config.platform === 'android')
			{
			indicator.height = 100,
			indicator.width = 100,
			indicator.style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
			indicator.backgroundColor = 'transparent';
			}
		else
			{
			indicator.height = 60,
			indicator.width = 60,
			indicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
			indicator.backgroundColor = '#333333';
			}
			
		view.add(indicator);
		
		if(!indicatorVisible)
			{
			view.visible = true;
			indicator.show();
			indicatorVisible = true;
			}
		};
		
	view.hideIndicator = function()
		{
		if(indicatorVisible)
			{
			indicator.hide();
			view.visible = false;
			indicatorVisible = false;
			indicator = null;
			}
		};
	
	return view;
	};