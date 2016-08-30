
/**
 * @author Cole Halverson
 * 
 * 
 * Handles the local SQLite database: whateverDB.  DB consists of 103 rows representing 103 'positions' (x and y coordinates)
 * for convo bubbles in the MainWindow.  The main reason for this is to allow conversation bubbles (bubViews) to persist in the 
 * same position across app and power cycles.  Also, the refresh utility checks the response of userConversations from GAE against 
 * the db to decide which conversations need to be deleted, or updated, or created.
 * 
 * 
 */

var config = require('config');


var dbName = config.dbName;
var db;

/**
 * Make sure the DB exists and is as expected.  This is called by app.js during each launch.
 */
exports.buildDB = function()
{
	
	//open db.  Creates it if not exist.
	db = Ti.Database.open(dbName);
	
	//use this when testing and made a change to the columns
	//db.execute('DROP TABLE IF EXISTS V1_bubbles');  
	
	//create V1_bubbles table if not exist
	db.execute('CREATE TABLE IF NOT EXISTS V1_bubbles (position TEXT, top_y REAL, convo_key INTEGER, creator INTEGER, new_info TEXT, in_out TEXT, happening_status TEXT, happening_date TEXT, happening_description TEXT, active_status TEXT, last_activity TEXT ) ');
		
	//see if it has been populated with rows yet
	var rows = db.execute('SELECT rowid from V1_bubbles');
	
	
	if (rows.rowCount != 103)     // this is the best way I could find to check if the DB is as the app expects it to be
	{
		//Load arrays with coordinates to be added to rows of the db
		var positionArray = ['center', 'left', 'right', 'center'];
	 	
	 	var topArray = [1.8217, 0.9147, 0.9147, 0];
		
		
		for (var loopCount = 0, centerYFactor = 2, sideYFactor = 1; loopCount < 33; )
		{
	 		
	 		topArray.push(0.9147 + (1.8217 * sideYFactor));
	 		positionArray.push('left');
	 		
	 		topArray.push(0.9147 + (1.8217 * sideYFactor));
	 		positionArray.push('right');
	 		
	 		topArray.push(1.8217 * centerYFactor);
	 		positionArray.push('center');
	 		
	 		sideYFactor++;
	 		centerYFactor++;
	 		loopCount++;	
	 	}
		
		
		//execute arrays to populate database
		for (i = 0; i < positionArray.length; i++)
		{
			var thisPosition = positionArray[i];
			var thisY = topArray[i];
		
			var row = [thisPosition, thisY];
		
			db.execute('INSERT INTO V1_bubbles (position, top_y) VALUES (?, ?)', row);	
		}
		
	}
	
	
	db.close();
	
	
	displayDB();
	
}; //end of buildDB()

	

function displayDB()  //simply writes all 103 DB rows to the console
{
	db = Ti.Database.open(dbName);
	
	var rows = db.execute('SELECT rowid, position, top_y, convo_key, creator, new_info, in_out, happening_status, happening_date, happening_description, active_status, last_activity from V1_bubbles');
	                  
	
	while (rows.isValidRow())
	{
		//Ti.API.info(   'Bubble ---> ROWID: ' + rows.fieldByName('rowid') + ' position: ' + rows.fieldByName('position') + ' top_y: ' + rows.fieldByName('top_y') + ' convo_key: ' + rows.fieldByName("convo_key") + ' creator: ' + rows.fieldByName("creator") + ' new_info: ' + rows.fieldByName('new_info') + ' in_out: ' + rows.fieldByName("in_out") +  ' happening_status: ' + rows.fieldByName("happening_status") + ' happening_date: ' + rows.fieldByName("happening_date") + ' happening_description: ' + rows.fieldByName("happening_description") + ' active_status: ' + rows.fieldByName("active_status") + ' last_activity: ' + rows.fieldByName("last_activity"));
		rows.next();
	}
	db.close();
}