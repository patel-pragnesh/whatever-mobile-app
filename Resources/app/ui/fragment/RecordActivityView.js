/**
 * The default navigation view
 * 
 * @param {Object} args
 * @param {Object} callback
 */
exports.create = function(args)
	{
	var config = require('app/config');
	
	var height = args.height;
	var countdownToRecordTime = 10;
	
	var view = Ti.UI.createView({
		backgroundColor: '#c8c8c8',
		height: args.height,
		width: '100%',
		left: 0,
		layout: 'vertical',
		hidden: true
		});
		
	view.hide();
		
	var timeLabel = Ti.UI.createLabel({
		color: 'white',
		font:
			{
			fontSize: 18,
			fontFamily: config.opensans_light
			},
		top: 20,
		textAlign: 'center',
		text: String.format(L('recording_beginning'), countdownToRecordTime.toString())
		});
		
	view.add(timeLabel);
	
	var countdownInterval;
		
	function startRecordingActivity()
		{
		// At ten, this will create a one second pause
		var count = 10;
		
		countdownInterval = setInterval(function()
			{
			if(count < 10)
				{
				timeLabel.text = String.format(L('recording_beginning'), '0' + count.toString());
				}
			
			if(count == 0)
				{
				clearInterval(countdownInterval);
				timeLabel.text = '00:00';
				}
				
			count--;
				
			}, 1000);
		}
		
	view.startActivity = function(callback)
		{
		if(view.hidden)
			{
			view.show();
			
			view.animate({top: view.top - args.height, duration: 600}, function()
				{
				view.hidden = false;
				startRecordingActivity();
				callback(true);
				});
			}
		else
			{
			callback(true);
			}
		};
		
	view.stopActivity = function(callback)
		{
		if(countdownInterval)
			{
			clearInterval(countdownInterval);
			}
		
		if(!view.hidden)
			{
			view.animate({top: view.top, duration: 400}, function()
				{
				// Reset the view to a beginning state
				timeLabel.text = String.format(L('recording_beginning'), countdownToRecordTime.toString());
				
				view.hidden = true;
				view.hide();
				callback(true);
				});
			}
		else
			{
			callback(true);
			}
		};
	
	return view;
	};