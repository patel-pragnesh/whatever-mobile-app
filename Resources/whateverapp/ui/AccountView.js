/**
 * The Account View
 * Shows up when the User wants to look at his/her account
 */
exports.create = function AccountView(toolbox, args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');
	var ZoomCropWindow = require('whateverapp/ui/ZoomCropWindow');

	// Create the main container - this holds the main components for the window
	var view = Ti.UI.createView({
		backgroundColor: 'blue',
		height: '100%',
		width: '100%',
		left: config.viewOffset,
		zIndex: 2
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
		toolbox.openClose(view, function() {/* OPENED! */}, function() { /* CLOSED! */});
		});
	
	
	
	
	/*
	 * 
	 * The view for the profile image view to be contained in
	 */
	var profileImageView = Ti.UI.createView({
		//width:Ti.UI.SIZE,
		//height: Ti.UI.SIZE,
		width:100,
		height:100,
		left: '0%',
		top: '0%'
		});
	
	/*
	 * 
	 * The Actual view of the image
	 */
	var profileImage = Ti.UI.createImageView({
		backgroundColor:'transparent',
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		zIndex: 1
		});
		
	
		
	/*
	 * Profile Image View Setting and Editing
	 * TODO: Retrieve current profile image and add default image to project and set it here
	 */
		/*
	if(whatever.getAccount().profileImageUrl)
		{
			profileImage.image - whatever.getAccount().profileImageUrl;
			
			var profileEditView = Ti.UI.createImageView({
				backgroundColor: 'gray',
				bottom: 0,
				right: 0,
				width: 38,
				height: 17,
				touchEnabled: false,
				zIndex: 2
				});
			profileImageView.add(profileEditView);
		}
	else 
		{
			//profileImage.image = "whateverapp/image/whatever-account-defaultavatar.png";
			//TODO: Add default profile image here
		}*/
		
	profileImage.image = "whateverapp/image/default-avatar.jpg";
	function profileImageClickEvent(e) 
		{
		profilePicPlaceHolder.removeEventListener('click', profileImageClickEvent);

		Ti.Media.openPhotoGallery(
			{
			success: function(pe)
				{
				var photo = pe.media;
				
				var zoomCropWindow = new ZoomCropWindow(photo, function(success, imageData)
					{
					if(success)
						{
						
						profileImage.image = imageData.image;											
						}
					profilePicPlaceHolder.addEventListener('click', profileImageClickEvent);
					});
				zoomCropWindow.open();
				},
			cancel: function() 
				{
					profilePicPlaceHolder.addEventListener('click', profileImageClickEvent);
				},
			error: function(error) 
				{
					alert(error);
					profilePicPlaceHolder.addEventListener('click', profileImageClickEvent);
				},
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
		}
		
	//Add the profile image to the view
	profileImageView.add(profileImage);
	
	
	//Creates a scroll view
	var scrollView = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		top: 0, bottom: 0,
		width: '100%',
		layout: 'vertical',
		});

	//We do not want the image to bounce past the bounds, otherwise the user would see ugly emptiness
	scrollView.verticalBounce = false;
	scrollView.disableBounce = true;
	
	scrollView.addEventListener('scroll', function(e) {
		//Scroll parallax, the profile image will move 1/3 as slow as the scroll.
		profileImageView.top = -e.y/3;
		
		});
	
	var profilePicPlaceHolder = Ti.UI.createView({
		width:'100%',
		height: '60%',
		left: 0,
		top: 0
		});
	//If click, open up select image dialogue
	profilePicPlaceHolder.addEventListener('click', profileImageClickEvent);
	
	var nameAndNumberHeader = Ti.UI.createView({
		top:0,
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundGradient: 
			{
	        type: 'linear',
	        startPoint: { x: '0%', y: '0%' },
	        endPoint: { x: '0%', y: '100%' },
	        colors: [ { color: 'transparent', offset: 0.0}, { color: 'black', offset: 1.0 }],
	    	},
	    layout:'vertical'
		});
	
	var nameLabel = Ti.UI.createLabel({
		color: '#FFFFFF',
		width: Ti.UI.SIZE,
		font:
			{
			fontSize: 18,
			fontWeight: 'bold'
			},
		text: "Jackson C. Smith",
		left: 10
		});
		
	var numberLabel = Ti.UI.createLabel({
		color: "#FFFFFF",
		width: Ti.UI.SIZE,
		font:
			{
			fontSize: 12,
			fontWeight: 'bold'
			},
		text: "+1-406-529-9591",
		left:10
		});
		
	nameAndNumberHeader.add(nameLabel);
	nameAndNumberHeader.add(numberLabel);
	
	
	var profileItemsView = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'gray',
		layout: 'vertical'
	})
	
	
	var emailButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '0%', right: 0,
		width: '100%',
		height: 50,
		title: 'Email: Custard7@gmail.com',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
		
	var whoCanSeeButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '0%', right: 0,
		width: '100%',
		height: 50,
		title: 'Who can see me:  Friends of Friends',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
		
	var notificationSettingsButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '0%', right: 0,
		width: '100%',
		height: 50,
		title: 'Notification Settings',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
		
	var pinSetupButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '0%', right: 0,
		width: '100%',
		height: 50,
		title: 'PIN Settings',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});

	var logoutButton = Ti.UI.createButton({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
		color: '#333333',
		backgroundColor: exports.color,
		borderColor: '#888888',
		top: 0,
		left: '0%', right: 0,
		width: '100%',
		height: 50,
		title: 'Logout',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius:0
		});
	
	/*
	 * Add All items to the profile items view
	 */
	profileItemsView.add(emailButton);
	profileItemsView.add(whoCanSeeButton);
	profileItemsView.add(notificationSettingsButton);
	profileItemsView.add(pinSetupButton);	
	profileItemsView.add(logoutButton);
	
	/*
	 * Add all Elements to the scroll view
	 */	
	scrollView.add(profilePicPlaceHolder);
	scrollView.add(nameAndNumberHeader);
	scrollView.add(profileItemsView);

	/*
	 * Add all the UI elements down here
	 * It allows for easy rearranging and 
	 * let's us see how everything is ordered quickly
	 */
	
	view.add(profileImageView);
	view.add(scrollView);
	view.add(toolBtn);

	/*
	 * If the user swipes to the right when the toolbox is closed, it will open
	 * If the user swipes to the left when the toolbox is open, it will close
	 */
	view.addEventListener('swipe', function(e)
		{
		if(e.direction == 'right')
			{
			if(toolbox.state == toolbox.states.CLOSED)
				{
				toolbox.slideOpen(view, function() {});	
				}
			}
		else
			{
			if(toolbox.state == toolbox.states.OPEN)
				{
				toolbox.slideClosed(view, function() {});
				}
			}
		});

	return view;
	};
