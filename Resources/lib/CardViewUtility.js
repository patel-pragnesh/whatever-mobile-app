/**
 * Utility to handle the app's CardView.  Mostly to handle things happening in the disappearing view - i.e. the main buttons and thier functions.  
 */

exports.buildTimeString = function(timeString, happeningTime, abbreviate)
{
	var moment = require("lib/Moment");
	
	var string = "";
	
	var localDate = moment(happeningTime);
	
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
			if(abbreviate)
			{
				string = string + "Tom. Night";
			}else{
				string = string + "Tomorrow Night";
			}
			
		}else{
			string = string + "Tomorrow";
		}
	}
	else
	{
		if(abbreviate){
			string = string + localDate.format('dddd').substring(0,3) + ".";
		}else{
			string = string + localDate.format('dddd');
		}
		
		if(localDate.hour() > 12)
		{
			string = string + ' Night';
		}
	}
	
	return string;
};



