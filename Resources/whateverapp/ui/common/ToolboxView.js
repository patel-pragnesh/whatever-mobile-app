
/**
 * Toolbox window that has underlying options for the app
 * Opened to the side through a swipe gesture or open button
 */
exports.create = function (args, callback)
	{
	var config = require('whateverapp/config');
	
	// View states for this view
	var viewStates = {
		CLOSED: 0,
		OPENED: 1,
		CLOSING: 2,
		OPENING: 3
		};
	
	// Define the default and maximum slide speed for the view
	var defaultSlideSpeed = 500;

	/*
	 * The main window
	 */
	var view = Ti.UI.createView({
		backgroundColor: '#D9D9D9',
		height: '100%',
		width: '100%',
		left:'-50%',
		visible: true,
		layout: 'vertical',
		state: viewStates.CLOSED
		});
	
	// Set the view states into the view object
	view.states = viewStates;
		
	/*
	 * ADD TOOLBAR BUTTONS HERE
	 */
	var accountButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '25%', right: 0,
		width: '75%',
		height: 50,
		title: 'Jackson C. Smith',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
	
	//Add click event to push the account view to the window
	accountButton.addEventListener("click", function(e) 
		{
		Ti.App.fireEvent('pushview', {id: 'accountView'});
		});
		
	
	var settingsButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '25%', right: 0,
		width: '75%',
		height: 50,
		title: 'Settings',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
		
	//Add click event to push the account view to the window
	//TODO: Add/Remove settings window
	settingsButton.addEventListener("click", function(e) 
		{
		Ti.App.fireEvent('pushview', {id: 'accountView'});
		});
		
	
	var feedButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '25%', right: 0,
		width: '75%',
		height: 50,
		title: 'My Feed',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});	
	
	//Add click event to push the feed view to the window
	feedButton.addEventListener("click", function(e) 
		{
		Ti.App.fireEvent('pushview', {id : 'feedView'});
		});

	var friendsButton = Ti.UI.createButton({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
		color : '#333333',
		backgroundColor : exports.color,
		borderColor : '#888888',
		top : 0,
		left : '25%',
		right : 0,
		width : '75%',
		height : 50,
		title : 'Friends',
		style : Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius : 0
	});
	
	//Add click event to push the friends view to the window
	friendsButton.addEventListener("click", function(e) 
		{
		Ti.App.fireEvent('pushview', {id : 'friendsView'});
		}); 
		
		
	/*
	 * Add all toolbox buttons here
	 * Added down here so the buttons can be easily
	 * reordered
	 */
	view.add(accountButton);
	view.add(feedButton);
	view.add(friendsButton);
	view.add(settingsButton);
	
	/*
	 * Slide Open Opens the toolbar, animating the mainView to the right and 
	 * sliding the toolbox out to the right
	 */
	//TODO: FIX MainView Name conflict
	view.slideOpen = function(currentView, callback)
		{
		view.state = exports.STATE_OPENING;
		
		var animation = Ti.UI.createAnimation();
		animation.duration = defaultSlideSpeed;
		animation.left = '-25%';
		animation.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
		
		var animationHandler = function()
			{
			animation.removeEventListener('complete', animationHandler);
			view.state = exports.STATE_OPEN;
			callback();
			};
		
		animation.addEventListener('complete', animationHandler);
		
		view.animate(animation);
		
		var mainViewAnimation = Ti.UI.createAnimation();
		mainViewAnimation.duration = defaultSlideSpeed;
		mainViewAnimation.left = '75%';
		mainViewAnimation.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
		currentView.animate(mainViewAnimation);
		};
		
	/*
	 * Slide Closed Closes the toolbar, animating the mainView to the left and
	 * sliding the toolbox in to the left.
	 */
	view.slideClosed = function(currentView, callback)
		{
		view.state = viewStates.CLOSING;
					
		var animation = Ti.UI.createAnimation();
		animation.duration = defaultSlideSpeed;
		animation.left = '-50%';
		animation.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
		view.animate(animation);
		
		var animationHandler = function()
			{
			animation.removeEventListener('complete', animationHandler);
			view.state = viewStates.CLOSED;
			callback();
			}
		
		animation.addEventListener('complete', animationHandler);
		
		var mainViewAnimation = Ti.UI.createAnimation();
		mainViewAnimation.duration = defaultSlideSpeed;
		mainViewAnimation.left = '0%';
		mainViewAnimation.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
		currentView.animate(mainViewAnimation);	
		};
	
	/*
	 * This will check if the toolbox is open or closed and push it in the opposite direction
	 * Eg.: If toolbox is open, it will close.
	 * If toolbox is closed, it will open.
	 */
	view.openClose = function(currentView, callbackOpen, callbackClose)
		{
		if(view.state == viewStates.CLOSED)
			{
			view.slideOpen(currentView, callbackOpen);
			}
		else if(view.state == viewStates.OPEN)
			{
			view.slideClosed(currentView, callbackClose);
			}
		};

	return view;
	};