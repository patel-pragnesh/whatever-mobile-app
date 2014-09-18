/**
 * Create an availability day view
 * 
 * @param {Object} args
 */
exports.create = function(args)
	{
	var config = require('app/config');
	var moment = require('lib/moment');
	
	var currentDay = 1;
	var days = 3;
	var viewBuffer = 0;
	
	var view = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		top: 0
		});
	
	var scrollViewWidth;
	
	var scrollView = Ti.UI.createScrollView({
		backgroundColor: '#333333',
		contentWidth: 'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
		top: 0,
		width: '100%',
		height: 60,
		layout: 'horizontal'
		});
		
	var leftDayViewBuffer = Ti.UI.createView({
		backgroundGradient: {
			type: 'linear',
			startPoint: { x: '0%', y: 0 },
			endPoint: { x: '100%', y: 0 },
			colors: ['#333333', '#dadada']
			},
		left: 0,
		width: viewBuffer,
		height: 60
		});
		
	scrollView.add(leftDayViewBuffer);
		
	for(var i = 0; i < days; i++)
		{
		var dayView = require('app/ui/fragment/DayView').create(i + 1);
		scrollView.add(dayView);
		}
		
	var rightDayViewBuffer = Ti.UI.createView({
		backgroundGradient: {
			type: 'linear',
			startPoint: { x: '0%', y: 0 },
			endPoint: { x: '100%', y: 0 },
			colors: ['#dadada', '#333333']
			},
		left: 0,
		width: viewBuffer,
		height: 60
		});
		
	scrollView.add(rightDayViewBuffer);
		
	function updateDateView(date)
		{
		Ti.API.info('new day ' + moment().weekday(date.day()) + '  ' + date.format('D'));
		}
		
	var hasScrollEvent = false;
	
	function scrollEvent(e)
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
	
	view.add(scrollView);
	
	function delayScrollEventListener()
		{
		setTimeout(function() {
			scrollView.addEventListener('scroll', scrollEvent);
			}, 500);
		}
		
	function addScrollViewBuffers(scrollViewWidth)
		{
		viewBuffer = scrollViewWidth / 2;
		rightDayViewBuffer.width = viewBuffer;
		leftDayViewBuffer.width = viewBuffer;
		}
	
	var viewPostLayoutCallback = function(e)
		{
		view.removeEventListener('postlayout', viewPostLayoutCallback);
		scrollViewWidth = scrollView.rect.width;
		addScrollViewBuffers(scrollViewWidth);
		
		delayScrollEventListener();
		};
	
	view.addEventListener('postlayout', viewPostLayoutCallback);
	
	view.updateView = function()
		{
		Ti.API.info('updating the view');
		
		scrollView.removeEventListener('scroll', scrollEvent);
		
		var currentHour = moment().hour();
		
		// TODO - scroll to the most current conversation
		//scrollView.scrollTo((currentHour * 60) + 2, 0);
		
		delayScrollEventListener();
		};
		
	return view;
	};