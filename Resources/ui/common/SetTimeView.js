/*
 * scrollable view used for setting the time of when it's happening
 * 
 */

	
exports.createScroll = function(args, callback)
{
	var config = require('config');
	var moment = require('lib/Moment');
	var purple = config.purple;
	
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
			height: 27,
			image: 'images/clock'
		});
		typeView.add(clock);
		
		var timeStringLabel = Ti.UI.createLabel({
			left: 5,
			bottom: '10%',
			font: {fontFamily: 'AvenirNext-DemiBold',
					fontSize: 14}
		});
		typeView.add(timeStringLabel);
		
		var timeTextField = Ti.UI.createTextField({
			left: 5,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			top: 5,
			maxLength: 20,
			suppressReturn: true,
			horizontalWrap: false,
			font: {fontSize: 14,
					fontFamily: 'AvenirNext-Regular'},
			autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
		});
		typeView.add(timeTextField);
		
	holder.add(typeView);
	
	var time;

	holder.expand = function(expandArgs)
	{
		var currentTimeViewIndex;
		
		var views = [];
		var options = [{label: 'When? -->'}];
		
		//populate appropriate labels
		var now = moment();
		
		//if now is past 1am but before 4pm
		if(now.hour() >= 1 && now.hour() <= 15)
		{
			options.push(
				{label: 'Today', time: moment().hour(12).minute(0)}, 
			
				{label: 'Tonight', time: moment().hour(23).minute(59).second(0)}, 
			
				{label: 'Tomorrow', time: moment().add(1, 'd').hour(12).minute(0).second(0)}, 
		
				{label: 'Tomorrow Night', time: moment().add(1, 'd').hour(23).minute(59).second(0)}
						);
		}
		else
		{
			options.push(
				{label: 'Tonight', time: moment().hour(23).minute(59).second(0)}, 
			
				{label: 'Tomorrow', time: moment().add(1, 'd').hour(12).minute(0).second(0)}, 
		
				{label: 'Tomorrow Night', time: moment().add(1, 'd').hour(23).minute(59).second(0)}
						);
		}
		
		//add options for 3 more days beyond tomorrow
		for (d = 2; d < 5; d++)	
		{
			var day = moment().add(d, 'd');
			
			options.push(
				{label: day.format('dddd'), time: moment().add(d, 'd').hour(12).minute(0).second(0)}, 
			
				{label: day.format('dddd') + ' Night', time: moment().add(d, 'd').hour(23).minute(59).second(0)}
						);
		}
		
		for (i = 0; i < options.length; i++)
		{
			var view1 = Ti.UI.createView({
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				backgroundColor: purple,
				canType: false,
				showPicker: false,
				label: options[i].label,
				touchEnabled: false
			});
				
				var label = Ti.UI.createLabel({
					text: options[i].label,
					color: 'white',
					font: {fontSize: 20,
							fontFamily: 'AvenirNext-DemiBold'}
				});
				view1.add(label);
				
				if (i > 0)
				{
					view1.canType = true;
					view1.time = options[i].time;
				}
				
				
				var thisTime = moment(options[i].time);
				var currentHappeningTime = moment(expandArgs.happeningTime);
				if(expandArgs.editing && thisTime.isSame(currentHappeningTime, 'hour'))
				{
					Ti.API.info('same!' + i);
					currentTimeViewIndex = i;
				}
			views.push(view1);	
		}
			
		view.setViews(views);
		
		view.addEventListener('singletap', function(e){	
			if(e.source.getCurrentPage() == e.source.getViews().length - 1){
				e.source.scrollToView(1);
			}else{
				e.source.scrollToView(e.source.getCurrentPage() + 1);
			}
		});
		
		view.addEventListener('scrollend', function(e){
			if(e.view.canType)
			{
				timeStringLabel.setText(e.view.label);
				typeView.setHeight(Ti.UI.SIZE);
				timeTextField.focus();
			}else{
				typeView.setHeight(0);
				timeTextField.blur();
			}
			if(e.view.time){
				Ti.API.info('view time = ' + e.view.time.format("dddd, MMMM Do YYYY, h:mm:ss a"));
				time = e.view.time;
			}
		});
		
		holder.setHeight(Ti.UI.SIZE);
		
		if(expandArgs.editing)
		{
			view.scrollToView(currentTimeViewIndex);
			timeTextField.setValue(expandArgs.timeString);
		}
		else
		{
			view.scrollToView(0);
		}
		
		holder.animate({opacity: 1.0, duration: 200, delay: 500});
	};

	
	
	
	
	
	holder.collapse = function()
	{
		holder.animate({opacity: 0.0, duration: 200}, function(){
			holder.setHeight(0);
			view.scrollToView(0);
			timeTextField.setValue("");
		});
	}; 
	
	holder.blur = function()
	{
		timeTextField.blur();
	};
	
	holder.getCurrentPage = function()
	{
		return view.getCurrentPage();
	};
	
	holder.getTime = function()
	{
		return time.valueOf();
	};
	
	holder.getTimeString = function()
	{
		if(view.getCurrentPage() > 0)
		{
			return timeTextField.getValue();
		}else{
			return null;
		}
	};
	
	return holder;
};


