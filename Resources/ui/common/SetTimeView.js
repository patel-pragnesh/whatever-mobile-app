/*
 * scrollable view used for setting the time of when it's happening
 * 
 */

	var config = require('config');
	var moment = require('lib/Moment');
	var purple = config.purple;
exports.createScroll = function(args, callback)
{
	var holderHeight;
	var typeViewHeight;
	
	var holder = Ti.UI.createView({
		width: '92%',
		height: 0,
		top: 5,
		bottom: 15,
		layout: 'vertical',
		opacity: 0.0
	});
	
		
	var view = Ti.UI.createScrollableView({
		width: '100%',
		height: 50,
		top: 0
	});
	holder.add(view);
	
	var typeView = Ti.UI.createView({
		height: 0,
		top: 5,
		width: '90%',
		layout: 'horizontal',
		horizontalWrap: false,
		right: 0
	});
		
		var clock = Ti.UI.createImageView({
			left: 0,
			image: 'images/clock'
		});
		typeView.add(clock);
		
		var dash = Ti.UI.createLabel({
			text: ' - ',
			left: 3,
			font: {fontFamily: 'AvenirNext-Regular',
					fontSize: 20}
		});
		typeView.add(dash);
		
		var timeText = Ti.UI.createTextField({
			left: 0,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			top: 5,
			maxLength: 20,
			suppressReturn: true,
			horizontalWrap: false,
			font: {fontSize: 17,
					fontFamily: 'AvenirNext-Regular'}
		});
		typeView.add(timeText);
		
		var pickerView = Ti.UI.createView({
			top: 0,
			height: 0,
			width: Ti.UI.FILL
		});
		
			var timePicker = Ti.UI.createPicker({
				width: Ti.UI.FILL,
				type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
				top: 0,
				minuteInterval: 15
			});
		pickerView.add(timePicker);
	holder.add(pickerView);
	holder.add(typeView);
	
	var views = [];
	var labels = ['When? >>>', 'Right Now!', 'Tonight', 'Tomorrow Morning', 'Tomorrow Afternoon', 'Tomorrow Night', 'Later Date'];
	
	for (i = 0; i < labels.length; i++)
	{
		var view1 = Ti.UI.createView({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			backgroundColor: purple,
			canType: false,
			showPicker: false
		});
			
			var label = Ti.UI.createLabel({
				text: labels[i],
				color: 'white',
				font: {fontSize: 20,
						fontFamily: 'AvenirNext-DemiBold'}
			});
			view1.add(label);
			
			if(i > 1 && i < 6)
			{
				view1.canType = true;
			}
			
			if (labels[i] == 'Later Date')
			{
				view1.showPicker = true;
			}
			
		views.push(view1);	
	}
		
	view.setViews(views);
	
	view.addEventListener('scrollend', function(e){
		if(e.view.canType)
		{
			typeView.setHeight(Ti.UI.SIZE);
			timeText.focus();
		}else{
			typeView.setHeight(0);
			timeText.blur();
		}
		
		if(e.view.showPicker)
		{
			pickerView.setHeight(Ti.UI.SIZE);
			holder.setBottom(0);
		}
		else{
			pickerView.setHeight(0);
			holder.setBottom(15);
		}
	});
	
	holder.expand = function()
	{
		holder.setHeight(Ti.UI.SIZE);
		holder.animate({opacity: 1.0, duration: 200});
	};
	
	holder.collapse = function()
	{
		holder.animate({opacity: 0.0, duration: 200}, function(){
			holder.setHeight(0);
			view.scrollToView(0);
			timeText.setValue("");
		});
	};
	
	holder.blur = function()
	{
		timeText.blur();
	};
	
	holder.getCurrentPage = function()
	{
		return view.getCurrentPage();
	};
	
	return holder;
};


