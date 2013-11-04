/**
 * Opened after login or account creation
 * This window contains the core functionality of the app
 */
function MainWindow(args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	
	/*
	 * Assign objects to all views that need to be loaded
	 */
	var AccountView = require('whateverapp/ui/AccountView');
	var FeedView = require('whateverapp/ui/FeedView');
	var FriendsView = require('whateverapp/ui/FriendsView');
	
	/*
	 * Our discretely held views lie here
	 * They will be created once and then refreshed upon 
	 * reopening them
	 */
	var currentView;
	var accountView;
	var feedView;
	var friendsView;
	
	/*
	 * The main window
	 */
	var win = Ti.UI.createWindow({
		backgroundColor: 'blue',
		width: '100%',
		fullscreen: false,
		orientationModes: [Ti.UI.PORTRAIT]
		});

	if(config.platform === 'android')
		{
		win.navBarHidden = true;
		win.exitOnClose = true;
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
		
	//Add a toolbox to the window
	var toolbox = require('whateverapp/ui/common/ToolboxView').create();
	toolbox.zIndex = 1;
	
	//Since all views start with a 75% offset when opened from the toolbox, the first view must be set back to the left side of the screen.
	feedView = FeedView.create(toolbox);
	feedView.left = 0;
	currentView = feedView;
	
	// Create this here so it can be referenced in the main window as a variable
	var notificationView = require('whateverapp/ui/common/NotificationView').create(); // zIndex = 10
	
	/*
	 * The Push View event
	 * Accessible from anywhere in the app
	 * Accepts a single string argument (id) which pushes the respective view into the window.
	 * Checks if the view has been loaded, if it has not - it creates a new one. If it has - it pushes the old one into the window.
	 */
	Ti.App.addEventListener('pushview', function(e)
		{
		//Removes the current view
		win.remove(currentView);
		
		//Switches the id of the argument
		switch(e.id) 
			{
			case 'accountView':
				//Checks if AccountView has already been created
				if(accountView == null)
					{
					//Creates a new AccountView if there isn't already one
					accountView = AccountView.create(toolbox);
					}
				//Set the currentview to the account view.
				currentView = accountView;
				break;
			case 'feedView':
				//Checks if FeedView has already been created
				if(feedView == null)
					{
					//Creates a new FeedView if there isn't already one
					feedView = FeedView.create(toolbox);
					}
				//Sets the current view to the feed view;
				currentView = feedView;
				break;
			case 'friendsView':
				//Checks if FriendView has already been created
				if(friendsView == null)
					{
					//Creates a new FriendView if there isn't already one
					friendsView = FriendsView.create(toolbox);
					}
				//Sets the current view ot the friends view;
				currentView = friendsView;
				break;
			default:
				//If the id is not recognized, throw an error
				Ti.API.error("Push View Event ID NOT FOUND: " + e.id);
				break;
			}
			
		//Add the newly pushed view to the window
		win.add(currentView);
		//Close the toolbox once again
		toolbox.slideClosed(currentView, function(e) {});
		});
	
	/*
	 * Add the containers to the window
	 * We define them above so they can be referenced prior to being added to the window
	 */
	win.add(toolbox);
	win.add(feedView);
	win.add(notificationView);

	return win;
	};

module.exports = MainWindow;