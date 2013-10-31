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
		height: '100%',
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
	
	/*
	 * ToolBtn will open/close the Toolbox when pressed depending if it 
	 * is open or closed
	 */
	var toolBtn = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: 'black',
		backgroundColor: 'gray',
		left: 5, top: 5,
		width: 40, height: 40,
		title: '',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 0,
		borderColor: 'white'
		});
	
	toolBtn.addEventListener('click', function(e)
		{
		toolbox.openClose(mainView, function() {/* OPENED! */}, function() { /* CLOSED! */});
		});
	
	view.add(toolBtn);
	
	
	//The bar to set if you are available or not and to see upcoming conversations.
	var availabilityBar = Ti.UI.createView({
			backgroundColor: '#FF0000',
			width: '100%',
			height: 60
			});
	view.add(availabilityBar);

	
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
	
	


