/**
 * The Friends View
 * Shows up when the User would like to see his/her friends
 * If they have friends that is...
 */
exports.create = function FriendsView(toolbox, args, callback)
	{
	var config = require('whateverapp/config');
	var whatever = require('whateverapp/whatever');

	// Create the main container - this holds the main components for the window
	var view = Ti.UI.createView({
		backgroundColor: 'green',
		height: '100%',
		width: '100%',
		left: config.viewOffset,
		layout: 'vertical',
		zIndex: 2
		});
		
	var navigationView = require('whateverapp/ui/common/NavigationView').create();
	
	navigationView.toolButton.addEventListener('click', function(e)
		{
		toolbox.openClose(view, function() {/* OPENED! */}, function() { /* CLOSED! */});
		});
		
	view.add(navigationView);
	
	var scrollView = Ti.UI.createScrollView({
		backgroundColor: 'black',
		borderWidth: 1,
		borderColor: 'white',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
		contentHeight: Ti.UI.SIZE,
		contentWidth: Ti.UI.SIZE,
		});

	var imageView;
	
	if(config.platform === 'android')
		{
		var photoView = require('com.mywebrank.photoview');

		var photoImageView = photoView.createPhotoView({
			backgroundColor: 'transparent',
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			images: ["whateverapp/image/whatever-account-defaultavatar.jpg"]
			});
		
		// Place the photo image view into a view
		// Do this because if we use the scrollview for the image, we get the edge effects of the scrollview
		imageView = Ti.UI.createView({
			left: 0,
			top: 0,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
			});
			
		imageView.add(photoImageView);
		}
	else
		{
		imageView = Ti.UI.createImageView({
			image: "whateverapp/image/whatever-account-defaultavatar.jpg",
			left: 0,
			top: 0,
			width: '200%',
			height: '200%'
			});
		}
			
	scrollView.add(imageView);	
	view.add(scrollView);
	
	scrollView.addEventListener('scroll', function(e)
		{
		Ti.API.info("Scroll Position: " + e.x + ", " + e.y);
		var toast = Titanium.UI.createNotification({
		    duration: 100,
		    message: "Scroll Position: " + e.x + ", " + e.y
			});
		toast.show();
		});

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