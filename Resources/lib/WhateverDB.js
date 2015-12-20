/**
 * @author Cole Halverson
 */
/**
 * @author Cole Halverson
 * 
 * 
 * Handles the local SQLite database: whateverDB.  DB consists of rows of indexes representing 103 'positions' (x and y coordinates)
 * for convo bubbles in the MainWindow.
 * 
 * 
 */

var config = require('config');


var dbName = config.dbName;
var db;

/**
 * Make sure the DB exists
 */

exports.checkExistence = function()
{
	Ti.API.info('check exist');
	
	db = Ti.Database.open(dbName);
	var lastRow = db.getLastInsertRowID();
	Ti.API.info('lastRow = ' + lastRow);
   
 	if(lastRow == undefined)
 	{
 		buildDB();
 		
 	}else{
 		db.close();
 	}
};


function buildDB()
{
	Ti.API.info('buildDB');
	
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
	
	
	
	
	//db.execute("DROP TABLE bubbles");  //ONLY USE THIS FOR TESTING!  WILL BREAK IF FIRST TIME RUNNING ON DEVICE OR SIM
	
	//build table in db if not exist
	db.execute('CREATE TABLE IF NOT EXISTS bubbles (position TEXT, top_y TEXT, convo_key TEXT, user_type TEXT, new_info TEXT, in_out TEXT, happening_status TEXT, happening_date TEXT, happening_description TEXT, active_status TEXT, last_activity TEXT ) ') ;
	
	db.execute('DELETE FROM bubbles');
	
	
	//execute coordinates to db
	for (i = 0; i < positionArray.length; i++)
	{
		var thisPosition = positionArray[i];
		var thisY = topArray[i];
	
		var row = [thisPosition, thisY];
	
		db.execute('INSERT INTO bubbles (position, top_y) VALUES (?, ?)', row);	
	}
	
	db.close();
	
	Update();
	
} //end of buildDB()

function Update()
{
	//open the database
	db = Ti.Database.open(dbName);
	
	
	
	var testConvo4 = {};
		testConvo4.convoKey = 44444;
		testConvo4.userType = "CREATOR";
		testConvo4.newInfo = 'true';
		testConvo4.inOut = 'false';
		testConvo4.hapStatus = 'happening';
	
	
	var rows = db.execute("SELECT rowid FROM bubbles WHERE convo_key is null LIMIT ?", 1);
	
	while (rows.isValidRow())
	{
		currentObject = testConvo4;
		currentRow = rows.fieldByName('rowid');
		update = [currentObject.convoKey, currentObject.userType, currentObject.newInfo, currentObject.inOut, currentObject.hapStatus, currentRow];
		db.execute('UPDATE bubbles SET convo_key = ?, user_type = ?, new_info = ?, in_out = ?, happening_status = ?  WHERE rowid=?', update);
		rows.next();
	}
	
	
	
	displayDB();
	
	/**
	var conversations = [];
	var occupiedRows = db.execute("SELECT position, top_y, convo_key, user_type, new_info, in_out, happening_status, happening_date FROM bubbles WHERE convo_key is not null");
	                              
	
	
	while (occupiedRows.isValidRow())
	{
		
		var conversation = {};
			
			conversation.position = occupiedRows.fieldByName('position');
			conversation.top_y = occupiedRows.fieldByName('top_y');
			conversation.convo_key = occupiedRows.fieldByName('convo_key');
			conversation.created_by = occupiedRows.fieldByName('created_by');
			conversation.new_info = occupiedRows.fieldByName('new_info');
			conversation.in_out = occupiedRows.fieldByName('in_out');
			conversation.happening_status = occupiedRows.fieldByName('happening_status');
			conversation.happening_date = occupiedRows.fieldByName('happening_date');
			
		conversations.push(conversation);
		
		occupiedRows.next();
	}
		
	Ti.API.info('conversations lenght = ' + conversations.length);
	
	return conversations;
	*/
	db.close();
};

	

function displayDB()
{
	var rows = db.execute('SELECT rowid, position, top_y, convo_key, user_type, new_info, in_out, happening_status, happening_date, happening_description, active_status, last_activity FROM bubbles');
	                  
	while (rows.isValidRow())
	{
		Ti.API.info(   'Bubble ---> ROWID: ' + rows.fieldByName('rowid') + ' position: ' + rows.fieldByName('position') + ' top_y: ' + rows.fieldByName('top_y') + ' convo_key: ' + rows.fieldByName("convo_key") + ' user_type: ' + rows.fieldByName("user_type") + ' new_info: ' + rows.fieldByName('new_info') + ' in_out: ' + rows.fieldByName("in_out") +  ' happening_status: ' + rows.fieldByName("happening_status") + ' happening_date: ' + rows.fieldByName("happening_date") + ' happening_description: ' + rows.fieldByName("happening_description") + ' active_status: ' + rows.fieldByName("active_status") + ' last_activity: ' + rows.fieldByName("last_activity"));
		rows.next();
	}
	
}