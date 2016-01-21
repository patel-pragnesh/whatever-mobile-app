/**
 * 
 * RefresherUtility is called by and app 'refresh event via BubblesView after an app launch, the resumed function in app.js, 
 * 	a recievePush() fired event, or the user by requesting it.  It gets the userConversations from app engine
 * 	and then updates the local DB and fires app events to update the UI as necessary.  
 * 
 * @author Cole Halverson
 */
var config = require('config');
var dbName = config.dbName;

var toDelete;

/**
this lets the RefreshUtility know this is the first refresh after app launch, in which case,
each conversation in the response from GAE needs a bubView and a card created for it.
*/
var launching = true;



exports.checkDeletes = function(response, callback)
{
	//check for deletes
	var db = Ti.Database.open(dbName);
	toDelete = [];
	
	//get rows from db that contain a conversation
	localConvos = db.execute('SELECT rowid, convo_key FROM V1_bubbles WHERE convo_key is not null');
		
		//compare the conversations contained in DB with the ones recieved from GAE. Remove the convos not recieved from GAE. 
		if (localConvos.rowCount > 0)
		{
			while (localConvos.isValidRow())
			{
				var removeConvo = true;
				for(i = 0; i < response.length; i++)
				{
					if (localConvos.fieldByName('convo_key') == response[i].conversationId)
					{
						removeConvo = false;
						break;
					}
				}
				
					if (removeConvo)
					{
						//call app event to tell this conversations bubView to delete itself
						Ti.App.fireEvent('app:DeleteBubble:' + localConvos.fieldByName('convo_key'));
						//call app event to tell this conversations cardView to delete itself
						Ti.App.fireEvent('app:DeleteCard:' + localConvos.fieldByName('convo_key'));
						
						//then add it to array to be deleted from DB
						toDelete.push(localConvos.fieldByName('rowid'));
						Ti.API.info('deleting ' + localConvos.fieldByName('convo_key'));
					}
				
				localConvos.next();
			}	
		}
	
	if (toDelete.length > 0)
	{
		callback(true, toDelete);
	}else{
		callback(false);
	}
	
	
	localConvos.close();
	
	db.close();
};


exports.updateDB = function(response)
{
	//var httpClient = require('lib/HttpClient');
	var config = require('config');

	var dbName = config.dbName;
	var account; 
	
	
	for (i = 0; i < response.length && i < 103; i++)
	{
		var db = Ti.Database.open(dbName);
		
		//query the DB to see if this convesation from GAE is already present
		var thisConvo = response[i];
		
		var row = db.execute('SELECT rowid FROM V1_bubbles WHERE convo_key is (?)', thisConvo.conversationId.toString());
		
		//if not present, add it to the first vacant row
		if (row.rowCount == 0)
			{
				var vacantRow = db.execute('SELECT rowid, position, top_y FROM V1_bubbles WHERE convo_key is null LIMIT 1');
				
				//update the db
				var update = [thisConvo.conversationId, thisConvo.status, thisConvo.userId, vacantRow.fieldByName('rowid').toString()];
				db.execute('UPDATE V1_bubbles SET convo_key = ?, happening_status = ?, creator = ? WHERE rowid = ?', update);
				
				thisConvo.position = vacantRow.fieldByName('position');
				thisConvo.top_y = vacantRow.fieldByName('top_y');
				
				vacantRow.close(); 
				row.close();
				db.close();
				
				//Fire app event to tell BubblesView to create a bubble for this conversation
				Ti.App.fireEvent('app:ConstructBubble', thisConvo);
				
				//local push notification gets fired here
				
			}
		
		//if present, update the DB row
		else 
			{
				var localConvoState = db.execute('SELECT position, top_y, happening_status FROM V1_bubbles WHERE rowid = ?', row.fieldByName('rowid'));
				
				//if this is first refresh after launch, fire app event to tell BubblesView to create a bubble for this conversation
				if (launching)
				{
					thisConvo.position = localConvoState.fieldByName('position');
					thisConvo.top_y = localConvoState.fieldByName('top_y');
					Ti.App.fireEvent('app:ConstructBubble', thisConvo);
				}else{
					Ti.App.fireEvent('app:UpdateBubble:' + thisConvo.conversationId , thisConvo);
					
				}
				
				localConvoState.close();
				row.close();
				db.close();
				
				//extract the comments and fire event to update
				Ti.App.fireEvent('app:UpdateComments:' + thisConvo.conversationId, {comments: thisConvo.comments});
				
				
				//local push notifications fire here
			}
		
	}
	launching = false;
};


exports.doDeletesFromDB = function(toDelete)
{
	if (toDelete.length > 0)
	{
		var db = Ti.Database.open(dbName);
		db.execute('BEGIN'); // begin the transaction
		
		for(var i=0; i < toDelete.length; i++) 
		{
		var rowid = toDelete[i];
		Ti.API.info('final delete of ' + rowid);
		db.execute('UPDATE V1_bubbles SET convo_key = null, creator = null, new_info = null, in_out = null, happening_status = null, happening_date = null, happening_description = null, active_status = null, last_activity = null WHERE rowid = ? ', rowid);
		}
	
		db.execute('COMMIT'); //commit the transaction
		db.close();
	}
	
};
