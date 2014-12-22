function MainWindow(conversations)
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
		var conversation = require('/app/ui/fragment/ConversationView').create();
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
		height: 51,
		});
		
	var menuBarSeparator = Ti.UI.createView({
		backgroundColor: 'black',
		top: 0,
		width: '100%',
		height: 1
		});
		
	menuBarContainer.add(menuBarSeparator);
	
	var menuBarView = Ti.UI.createView({
		backgroundColor: '#F6F5F1',
		width: '100%',
		top: 0,
		height: 50,
		opacity: .8
		});
		
	menuBarContainer.add(menuBarView);
	
	var menuBarActionView = Ti.UI.createView({
		width: '100%',
		top: 0,
		height: 50,
		layout: 'horizontal'
		});
		
	var buttonGroup = [];
	
	function toggleIconState(parent)
		{
		for(var c in parent.children)
			{
			if(parent.children[c].id == parent.type + '-icon')
				{
				if(parent.active)
					{
					parent.children[c].image = '/images/' + parent.type + '.png';
					}
				else
					{
					parent.children[c].image = '/images/' + parent.type + '-active.png';
					}
				}
				
			if(parent.children[c].id == parent.type + '-label')
				{
				if(parent.active)
					{
					parent.children[c].color = '#333333';
					parent.active = false;
					}
				else
					{
					parent.children[c].color = '#6B20B7';
					parent.active = true;
					}
				}
			}
		}
	
	function toggleButtonGroup(e)
		{
		if(!e.source.active)
			{
			for(var i = 0; i < buttonGroup.length; i++)
				{
				if(buttonGroup[i].active)
					{
					toggleIconState(buttonGroup[i]);
					break;
					}
				}
			
			toggleIconState(e.source);
			
			if(e.source.type == 'action-timeline')
				{
				Ti.API.info('Show Timeline');
				}
				
			if(e.source.type == 'action-notifications')
				{
				Ti.API.info('Show Notifications');
				}
				
			if(e.source.type == 'action-more')
				{
				Ti.API.info('Show More');
				}
			}
		}
		
	var timelineActionView = Ti.UI.createView({
		width: '33%',
		top: 0,
		height: 50,
		type: 'action-timeline',
		active: true
		});
	
	timelineActionView.addEventListener('click', toggleButtonGroup);
	buttonGroup.push(timelineActionView);
		
	var timelineActionIcon = Ti.UI.createImageView({
		id: 'action-timeline-icon',
		image: '/images/action-timeline-active.png',
		width: 27,
		height: 24,
		bottom: 19,
		touchEnabled: false
		});
		
	timelineActionView.add(timelineActionIcon);
		
	var timelineActionLabel = Ti.UI.createLabel({
		id: 'action-timeline-label',
		color: '#6B20B7',
		bottom: 5,
		font:
			{
			fontSize: 10,
			fontFamily: config.opensans_regular
			},
		text: L('timeline'),
		touchEnabled: false
		});
	
	timelineActionView.add(timelineActionLabel);
	menuBarActionView.add(timelineActionView);
	
	var notificationsActionView = Ti.UI.createView({
		width: '33%',
		top: 0,
		height: 50,
		type: 'action-notifications',
		active: false
		});

	notificationsActionView.addEventListener('click', toggleButtonGroup);	
	buttonGroup.push(notificationsActionView);
		
	var notificationsActionIcon = Ti.UI.createImageView({
		id: 'action-notifications-icon',
		image: '/images/action-notifications.png',
		width: 24,
		height: 22,
		bottom: 20,
		touchEnabled: false
		});
		
	notificationsActionView.add(notificationsActionIcon);
	
	var notificationCountView = Ti.UI.createView({
		backgroundColor: '#FF264A',
		borderColor: 'white',
		height: 18,
		width: 18,
		borderRadius: 9,
		right: 30,
		bottom: 28,
		touchEnabled: false
		});
		
	var notificationsCountLabel = Ti.UI.createLabel({
		color: 'white',
		font:
			{
			fontSize: 10,
			fontFamily: config.opensans_semibold
			},
		text: '99',
		touchEnabled: false
		});
		
	notificationCountView.add(notificationsCountLabel);
		
	notificationsActionView.add(notificationCountView);
		
	var notificationsActionLabel = Ti.UI.createLabel({
		id: 'action-notifications-label',
		color: '#333333',
		bottom: 5,
		font:
			{
			fontSize: 10,
			fontFamily: config.opensans_regular
			},
		text: L('notifications'),
		touchEnabled: false
		});
	
	notificationsActionView.add(notificationsActionLabel);
	menuBarActionView.add(notificationsActionView);
	
	var moreActionView = Ti.UI.createView({
		width: '33%',
		top: 0,
		height: 50,
		type: 'action-more',
		active: false
		});
		
	moreActionView.addEventListener('click', toggleButtonGroup);
	buttonGroup.push(moreActionView);
		
	var moreActionIcon = Ti.UI.createImageView({
		id: 'action-more-icon',
		image: '/images/action-more.png',
		width: 22,
		height: 16,
		bottom: 22,
		touchEnabled: false
		});
		
	moreActionView.add(moreActionIcon);
		
	var moreActionLabel = Ti.UI.createLabel({
		id: 'action-more-label',
		color: '#333333',
		bottom: 5,
		font:
			{
			fontSize: 10,
			fontFamily: config.opensans_regular
			},
		text: L('more'),
		touchEnabled: false
		});
	
	moreActionView.add(moreActionLabel);
	menuBarActionView.add(moreActionView);
	
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