function MainWindow()
	{
	var config = require('app/config');
	var whatever = require('app/whatever');
	
	var moment = require('lib/moment');
	var _ = require('lib/underscore');
	var httpClient = require('lib/httpclient');
	
	// Create the main window
	var win = require('app/ui/common/Window').create();
	win.opacity = 0;
	
	if(config.platform === config.platform_android)
		{
		win.exitOnClose = true;
		}
	
	// The notification view has a zIndex that blocks the UI and provides an indicator
	var notificationView = require('app/ui/common/NotificationView').create();
	
	var navigationHeight = 0;
	
	// Compensate for the iPhone status bar
	if(config.platform === 'iphone' && config.major >= 7)
		{
		navigationHeight = 20;
		
		var navigationView = Ti.UI.createView({
			backgroundColor: '#7945AD',
			top: 0,
			height: 20,
			width: '100%'
			});
			
		win.add(navigationView);
		}
	
	var mainContainerView = Ti.UI.createView({
		width: '100%',
		top: navigationHeight,
		bottom: 0,
		layout: 'vertical'
		});
	
	var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    
    var defaultSliderSize = 120;
    var dayViewOffSet = (((60 * hours) + minutes) - defaultSliderSize) * -1;
    
    /**
     * Create the availability view
     */
    var currentDay = 1;
	var days = 3;
	var viewBuffer = 0;
	
    var availabilityView = Ti.UI.createView({
		width: '100%',
		height: 60,
		top: 0
		});
	
	var availabilityScrollView = Ti.UI.createScrollView({
		backgroundColor: '#F2F2F2',
		contentWidth: 'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		top: 0,
		width: '100%',
		height: 60,
		layout: 'horizontal'
		});
		
	var leftDayViewBuffer = Ti.UI.createView({
		backgroundColor: '#F2F2F2',
		left: 0,
		width: viewBuffer,
		height: 60
		});
		
	availabilityScrollView.add(leftDayViewBuffer);
		
	for(var i = 0; i < days; i++)
		{
		var dayView = require('app/ui/fragment/DayView').create(i + 1);
		availabilityScrollView.add(dayView);
		}
		
	var rightDayViewBuffer = Ti.UI.createView({
		backgroundColor: '#F2F2F2',
		left: 0,
		width: viewBuffer,
		height: 60
		});
		
	availabilityScrollView.add(rightDayViewBuffer);
		
	function updateDateView(date)
		{
		Ti.API.info('new day ' + moment().weekday(date.day()) + '  ' + date.format('D'));
		}
	
	function availabilityScrollEvent(e)
		{
		//Ti.API.info(JSON.stringify(e));
		
		Ti.API.info(e.x);
		Ti.API.info(days * 24 * 60);
		
		if(e.x > 0 && e.x < days * 24 * 60)
			{
			var viewDay = Math.floor(e.x / (24 * 60));
			
			Ti.API.info(viewDay);
			}
		
		
		
		// var viewHour = ((e.x + viewBuffer) / 24) / (viewDay + 1);
// 		
		// Ti.API.info(moment().hour());
// 		
		// Ti.API.info(viewHour);
		
		if(viewDay >= 0 && currentDay !== viewDay)
			{
			updateDateView(moment().add(viewDay));
			currentDay = viewDay;
			}
		}
		
	// Add the scroll listener
	availabilityScrollView.addEventListener('scroll', availabilityScrollEvent);
	
	availabilityView.add(availabilityScrollView);
		
	var centerIndicatorView = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: '100%',
		touchEnabled: false
		});
		
	var centerHighlightView = Ti.UI.createView({
		backgroundColor: '#FF264A',
		height: '100%',
		width: 1
		});
		
	centerIndicatorView.add(centerHighlightView);
	
	var topIndicatorImage = Ti.UI.createImageView({
		image: '/images/availability-time-down-arrow.png',
		top: 0,
		width: 18,
		height: 8
		});
		
	centerIndicatorView.add(topIndicatorImage);
	availabilityView.add(centerIndicatorView);
    
	mainContainerView.add(availabilityView);
		
	var sliderSeparatorView = Ti.UI.createView({
		backgroundColor: '#7945AD',
		top: 0,
		height: 2,
		width: '100%'
		});
		
	mainContainerView.add(sliderSeparatorView);
	
	var scrollableView = Ti.UI.createScrollableView({
		backgroundColor: '#CBCACC',
		top: 0,
		bottom: 0,
		width: '100%'
		});
	
	// Create the conversations
	for(var i = 0; i < 10; i++)
		{
		var fakeTime = moment().add(i, "hour");
		
		var conversation = Ti.UI.createView({
			top: 0,
			bottom: 0,
			left: 10,
			right: 10,
			layout: 'vertical'
			});
		
		var timeIndicatorImageView = Ti.UI.createImageView({
			image: '/images/time-indicator-up-arrow.png',
			top: 5,
			width: 30,
			height: 15
			});
			
		conversation.add(timeIndicatorImageView);
		
		var conversationHeaderView = Ti.UI.createView({
			backgroundColor: 'white',
			top: 0,
			height: 40
			});
			
		conversation.add(conversationHeaderView);
		
		var conversationHeaderSeparatorView = Ti.UI.createView({
			backgroundColor: '#B3B3B3',
			top: 0,
			height: 1
			});
			
		conversation.add(conversationHeaderSeparatorView);
		
		var conversationScrollableView = Ti.UI.createScrollView({
			backgroundColor: 'transparent',
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: false,
			width: '100%',
			top: 0,
			bottom: 0,
			layout: 'vertical'
			});
			
		if(config.platform === 'iphone')
			{
			conversationScrollableView.disableBounce = true;
			}
		
		var conversationProfileView = Ti.UI.createView({
			backgroundColor: 'white',
			width: '100%',
			top: 0,
			height: 500
			});
			
		conversationScrollableView.add(conversationProfileView);
		
		var bottomShim = Ti.UI.createView({
			height: 10,
			width: '100%'
			});
		
		conversationScrollableView.add(bottomShim);
		
		conversation.add(conversationScrollableView);
		scrollableView.addView(conversation);
		}
		
	scrollableView.addEventListener('scrollend', function(e)
		{
		Ti.API.info(JSON.stringify(e));
		});
		
	mainContainerView.add(scrollableView);
	
	win.add(mainContainerView);
	win.add(notificationView);
	
	var menuBarContainer = Ti.UI.createView({
		width: '100%',
		bottom: 0,
		height: 50
		});
	
	var menuBarView = Ti.UI.createView({
		backgroundColor: '#F6F5F1',
		width: '100%',
		top: 0,
		height: 50,
		opacity: .65
		});
		
	menuBarContainer.add(menuBarView);
	
	var menuBarActionView = Ti.UI.createView({
		width: '100%',
		top: 0,
		height: 50
		});
		
	var actionViews = [];
		
	var timelineActionView = Ti.UI.createView({
		width: '33%',
		top: 0,
		height: 50,
		active: true
		});
		
	actionViews.push(timelineActionView);
		
	var timelineActionIcon = Ti.UI.createImageView({
		image: '/images/action-timeline-active',
		width: 27,
		height: 24,
		bottom: 18
		});
		
	timelineActionView.add(timelineActionIcon);
		
	var timelineActionLabel = Ti.UI.createLabel({
		color: '#6B20B7',
		bottom: 4,
		font:
			{
			fontSize: 10,
			fontFamily: config.opensans_regular
			},
		text: L('timeline')
		});
	
	timelineActionView.add(timelineActionLabel);
	menuBarActionView.add(timelineActionView);
	menuBarContainer.add(menuBarActionView);
	
	win.add(menuBarContainer);
	
	function scrollAvailabilityViewTo(hour, minute)
		{
		availabilityScrollView.removeEventListener('scroll', availabilityScrollEvent);
		availabilityScrollView.scrollTo((hour * 60) + minute, 0);
		availabilityScrollView.addEventListener('scroll', availabilityScrollEvent);
		}
	
	var windowPostLayoutCallback = function(e)
		{
		win.removeEventListener('postlayout', windowPostLayoutCallback);
		
		// Set the right and left buffers for the availability view
		viewBuffer = availabilityScrollView.rect.width / 2;
		rightDayViewBuffer.width = viewBuffer;
		leftDayViewBuffer.width = viewBuffer;
		
		// TODO - Scroll to the conversation equal to or next after
		};
	
	win.addEventListener('postlayout', windowPostLayoutCallback);
	
	var windowFocusCallback = function(e)
		{
		win.removeEventListener('focus', windowFocusCallback);
		
		win.animate({opacity: 1, duration: 400});
		
		// Register the device for push
		whatever.register();
		};
		
	win.addEventListener('focus', windowFocusCallback);

	return win;
	};

module.exports = MainWindow;