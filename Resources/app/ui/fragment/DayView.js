/**
 * Create an availability day view
 * 
 * @param {Object} args
 */
exports.create = function(day)
	{
	var config = require('app/config');
	
	//The bar to set if you are available or not and to see upcoming conversations.
	var view = Ti.UI.createView({
		backgroundColor: '#dfdfdf',
		width: 60 * 24,
		height: 60,
		top: 0,
		left: 0,
		layout: 'horizontal'
		});
		
	var hourLabelText;
	var periodText;
	
	for(var i = 0; i < 24; i++)
		{
		var hourLeft = 0;
		var halfHourLeft = 29;
		
		if(i > 0)
			{
			hourLeft = 29;
			halfHourLeft = 59;
			}
			
		if(i == 0)
			{
			periodText = 'a';
			hourLabelText = '12';
			}
		else if(i > 0 && i < 12)
			{
			periodText = 'a';
			hourLabelText = i;
			}
		else if(i == 12)
			{
			periodText = 'p';
			hourLabelText = '12';
			}
		else
			{
			periodText = 'p';
			hourLabelText = i - 12;
			}
			
		view.add(createHourView(i, hourLabelText, periodText));
		}
		
	function createHourView(index, hour, period)
		{
		var hourView = Ti.UI.createView({
			backgroundColor: '#e0e0e0',
			width: 60,
			height: 60,
			top: 0,
			left: 0
			});
			
		if(i > 0 && i < 24)
			{
			var hourIndicatorView = Ti.UI.createView({
				backgroundColor: '#a4a4a4',
				width: 2,
				height: 50,
				top: 0,
				left: 0
				});
			
			hourView.add(hourIndicatorView);
			}
		else if(day > 1)
			{
			var dayIndicatorView = Ti.UI.createView({
				backgroundColor: '#a4a4a4',
				width: 2,
				height: 60,
				top: 0,
				left: 0
				});
			
			hourView.add(dayIndicatorView);
			}
			
		var hourLabelView = Ti.UI.createView({
			top: 0,
			left: 2,
			width: 27,
			height: Ti.UI.SIZE
			});
			
		var hourLabelContainer = Ti.UI.createView({
			top: 0,
			width: Ti.UI.SIZE,
			height: 30,
			layout: 'horizontal'
			});
			
		var hourLabel = Ti.UI.createLabel({
			height: Ti.UI.FILL,
			bottom: 0,
			color: '#585858',
			font:
				{
				fontSize: 14,
				fontFamily: config.opensans_semibold
				},
			text: hour,
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
			});
		
		hourLabelContainer.add(hourLabel);
		
		var periodLabel = Ti.UI.createLabel({
			height: Ti.UI.FILL,
			left: 1,
			top: 0,
			color: '#585858',
			font:
				{
				fontSize: 11,
				fontFamily: config.opensans_light
				},
			text: period,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
			});
		
		hourLabelContainer.add(periodLabel);
		hourLabelView.add(hourLabelContainer);
		
		hourView.add(hourLabelView);
		
		var halfHourView = Ti.UI.createView({
			backgroundColor: '#a4a4a4',
			width: 1,
			height: 30,
			top: 0,
			left: 30
			});
			
		hourView.add(halfHourView);
		
		return hourView;
		};
		
	return view;
	};