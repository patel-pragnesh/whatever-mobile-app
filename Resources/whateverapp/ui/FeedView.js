/**
 * The Feed View
 * Shows up when the MainWindow first opens, displays the most
 * prominent attractions and events friends are 
 * setting up. The latest grub on the streets shows up here.
 */
exports.create = function FeedView(toolbox, args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	
	//A main view, so we can have a bottom bar overlapping the conversations.
	var mainView = Ti.UI.createView({
		backgroundColor: 'green',
		bottom: 0,
		width: '100%',
		left: config.viewOffset,
		zIndex: 2,
		});
	
	// Create the main container - this holds the main components for the window
	var view = Ti.UI.createView({
		backgroundColor: 'transparent',
		height: '100%',
		width: '100%',
		zIndex: 2,
		layout:'vertical'
		});
		
	var navigationView = require('whateverapp/ui/common/NavigationView').create();
	
	navigationView.toolButton.addEventListener('click', function(e)
		{
		toolbox.openClose(mainView, function() {/* OPENED! */}, function() { /* CLOSED! */});
		});
		
	view.add(navigationView);
	
	var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
	
	//The bar to set if you are available or not and to see upcoming conversations.
	var availabilityBarView = Ti.UI.createView({
		backgroundColor: 'gray',
		width: '100%',
		height: 60,
		layout: 'horizontal'
		});
	
	for(var i = 0; i < 24; i++)
		{
		var hourView = Ti.UI.createView({
			backgroundColor: 'transparent',
			borderColor: 'black',
			width: 60,
			height: 60
			});
		
		Ti.API.info(i);
		
		availabilityBarView.add(hourView);
		}
	
	view.add(availabilityBarView);
	
	/**
	 * This stuff is just filler stuff to demonstrate the vertical scrolling of conversations.
	 */
	var stuff1 = Ti.UI.createView({
			backgroundColor: '#000000',
			width: '100%',
			height: 200
			});
			
	var stuff2 = Ti.UI.createView({
			backgroundColor: '#333333',
			width: '100%',
			height: 400
			});
			
	var stuff3 = Ti.UI.createView({
			backgroundColor: '#F0F0F0',
			width: '100%',
			height: 200
			});
			
	var stuff4 = Ti.UI.createView({
			backgroundColor: '#555555',
			width: '100%',
			height: 400
			});
			
	//The first conversation.
	var conversation1 = Ti.UI.createScrollView({
			backgroundColor: '#FFFFFF',
			width: '90%',
			height: '100%',
			layout:'vertical',
			scrollType:'vertical',
			});
			
	conversation1.add(stuff1);
	conversation1.add(stuff2);
			
	//The second conversation.
	var conversation2 = Ti.UI.createScrollView({
			backgroundColor: '#0000FF',
			width: '90%',
			height: '100%',
			layout:'vertical',
			scrollType:'vertical',
			});
			
	conversation2.add(stuff3);
	conversation2.add(stuff4);

	//Holds all of the conversations for scrolling left and right.
	var conversationView = Ti.UI.createScrollableView({
		views:[conversation1, conversation2],
		showPagingControl: false,
		width: '100%',
		height: '85%'
		});
		
	view.add(conversationView);
	
	//Bottom bar to hold useful navigation buttons
	var bottomBar = Ti.UI.createView({
		backgroundColor: '#AA00AA',
		width: '100%',
		height: 60,
		opacity:0.5,
		zIndex: 3,
		bottom: '0%'
		});
	
	//Add the view with the toolbar, availability slider and the conversations.
	mainView.add(view);
	
	//Then add the bottom bar overtop that.
	mainView.add(bottomBar);

	return mainView;
	};