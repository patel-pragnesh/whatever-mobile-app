/**
 * The default navigation view
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args, parent)
	{
	var config = require('app/config');
	
	var account = Ti.App.Properties.getObject("account");
	
	var currentActivityView = null;
	
	// Contains the larger icon
	var view = Ti.UI.createView({
		height: 70,
		width: '100%',
		bottom: 0,
		left: 0
		});
		
	// Contains the smaller icons
	var actionView = Ti.UI.createView({
		backgroundColor: args.backgroundColor,
		height: 55,
		width: '100%',
		bottom: 0,
		left: 0,
		layout: 'horizontal'
		});
		
	/**
	 * Cancel the current activity
	 * 
 	 * @param {Object} callback
	 */
	function cancelActivity(callback)
		{
		if(currentActivityView == null)
			{
			callback(true);
			}
		else
			{
			currentActivityView.stopActivity(function(complete)
				{
				currentActivityView = null;
				callback(true);
				});
			}
		}
	
	/**
	 * Handles the state changes for the action buttons
	 * 
 	 * @param {Object} e
	 */
	function switchButtonStates(e)
		{
		cancelActivity(function(complete)
			{
			var position = e.source.position;
			var state = e.source.state;
			
			var activeState = messageMainActionButton.state;
			
			var actionBackgroundImage = '/images/' + activeState + '-button-small.png';
			var actionBackgroundSelectedImage = '/images/' + activeState + '-button-small-selected.png';
			
			if(position == 'left')
				{
				leftActionButton.backgroundImage = actionBackgroundImage;
				leftActionButton.backgroundSelectedImage = actionBackgroundSelectedImage;
				leftActionButton.state = activeState;
				}
			else
				{
				rightActionButton.backgroundImage = actionBackgroundImage;
				rightActionButton.backgroundSelectedImage = actionBackgroundSelectedImage;
				rightActionButton.state = activeState;
				}
				
			messageMainActionButton.backgroundImage = '/images/' + state + '-button-large.png';
			messageMainActionButton.backgroundSelectedImage = '/images/' + state + '-button-large-selected.png';
			messageMainActionButton.state = state;
			});
		}
		
	var leftActionView = Ti.UI.createView({
		width: '50%'
		});
	
	var leftActionButton = Ti.UI.createButton({
	    backgroundImage: '/images/text-button-small.png',
	    backgroundSelectedImage: '/images/text-button-small-selected.png',
		height: 35,
		width: 35,
		position: 'left',
		state: 'text'
	    });
	
	leftActionButton.addEventListener('click', switchButtonStates);
		
	leftActionView.add(leftActionButton);
	actionView.add(leftActionView);
	
	var rightActionView = Ti.UI.createView({
		width: '50%'
		});
	
	var rightActionButton = Ti.UI.createButton({
	    backgroundImage: '/images/video-button-small.png',
	    backgroundSelectedImage: '/images/video-button-small-selected.png',
		height: 35,
		width: 35,
		position: 'right',
		state: 'video'
	    });
	    
	rightActionButton.addEventListener('click', switchButtonStates);
	    
	rightActionView.add(rightActionButton);
	actionView.add(rightActionView);
		
	view.add(actionView);
		
	var decoratorView = Ti.UI.createView({
		backgroundColor: '#c8c8c8',
		bottom: 54,
		height: 1,
		width: '100%'
		});
		
	view.add(decoratorView);
	
	var messageMainActionButton = Ti.UI.createButton({
	    backgroundImage: '/images/record-button-large.png',
	    backgroundSelectedImage: '/images/record-button-large-selected.png',
	    bottom: 10,
		height: 60,
		width: 60,
		state: 'record'
	    });
	    
	messageMainActionButton.addEventListener('click', function()
		{
		if(messageMainActionButton.state == 'record')
			{
			currentActivityView = parent.recordActivityView;
			
			parent.recordActivityView.startActivity(function(complete)
				{
				if(complete)
					{
					
					}
				});
			}
			
		if(messageMainActionButton.state == 'video')
			{
			Ti.API.info('Video');
			}
			
		if(messageMainActionButton.state == 'text')
			{
			Ti.API.info('Text');
			}
		});
		
	view.add(messageMainActionButton);
	
	return view;
	};