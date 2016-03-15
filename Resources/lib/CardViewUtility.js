/**
 * Utility to handle the app's CardView.  Mostly to handle things happening in the disappearing view - i.e. the main buttons and thier functions.  
 */

exports.buildTimeString = function(timeString, happeningTime)
{
	var moment = require("lib/moment-with-locales");
	
	var string = "";
	
	var localDate = moment(happeningTime);
	Ti.API.info('local date = ' + localDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));
	
	if(moment().isSame(localDate, 'day'))
	{
		if(localDate.hour() > 12)
		{
			string = string + "Tonight";
		}else{
			string = string + "Today";
		}
	}
	else if(moment().add(1, 'd').isSame(localDate, 'day'))
	{
		if(localDate.hour() > 12)
		{
			string = string + "Tomorrow Night";
		}else{
			string = string + "Tomorrow";
		}
	}
	else
	{
		string = string + localDate.format('dddd');
		
		if(localDate.hour() > 12)
		{
			string = string + ' Night';
		}
	}
	
	return string;
};



