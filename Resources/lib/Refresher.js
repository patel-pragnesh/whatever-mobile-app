/**
 * 
 * Refresher is called by MainWindow after an app launch, the resumed function in app.js, 
 * 	a recievePush() fired event, or the user by requesting it.  It gets the userConversations from app engine
 * 	and then updates the local DB and fires app events to update the UI as necessary.  
 * 
 * @author Cole Halverson
 */
var httpClient = require('lib/HttpClient');
var config = require('config');



var dbName = config.dbName;


Ti.App.addEventListener('whatever e.data.event is from context.recievePush' , function(e)
{
	Refresh();
});

exports.resumedRefresh = function()
{
	Ti.API.info('resumedRefresh called');
	Refresh();
};

exports.calledByMainWindowRefresh = function()
{
	Ti.API.info('calledByMainWindowRefresh');
	Refresh();
};

var account; 

function Refresh()
{
	
	account = Ti.App.Properties.getObject('account');
	var url = '/v1/conversation?userId=' + account.id;
	
	httpClient.doGet(url, function(success, response)
	{
		if (success)
		{
			UpdateDB(response);
		}
		else
		{
			Ti.API.info('error doGet for userConversations');
		}
	});		
	
}

function UpdateDB(response)
{
	Ti.API.info('UpdateDB');
	
	//check for deletes
	var db = Ti.Database.open(dbName);
	var toDelete = [];
	
	localConvos = db.execute('SELECT rowid, convo_key FROM V1_bubbles WHERE convo_key is not null');
		
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
					//TODO Tell UI to remove the convo bubView right away
					
					//then add it to array to be deleted
					toDelete.push(localConvos.fieldByName('rowid'));
					Ti.API.info('deleting ' + localConvos.fieldByName('rowid'));
				}
			localConvos.next();
			}	
		}
		
	
	localConvos.close();
	db.close();
	
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
	
		db.execute('COMMIT');
		db.close();
	}
	
	

	var uiArgs = [];
	
	
	for (i = 0; i < response.length; i++)
	{
		var db = Ti.Database.open(dbName);
		//query whateverDB to see if the convesation is already present
		var thisConvo = response[i];
		Ti.API.info('thisConvo Id = ' + thisConvo.conversationId);
		
		var row = db.execute('SELECT rowid FROM V1_bubbles WHERE convo_key is (?)', thisConvo.conversationId.toString());
		
		Ti.API.info('row count = ' + row.rowCount);
		//if not present, add it to first vacant row
		if (row.rowCount == 0)
			{
				var vacantRow = db.execute('SELECT rowid FROM V1_bubbles WHERE convo_key is null LIMIT 1');
				
				//update the db
				var update = [thisConvo.conversationId, thisConvo.status, thisConvo.userId, vacantRow.fieldByName('rowid').toString()];
				db.execute('UPDATE V1_bubbles SET convo_key = ?, happening_status = ?, creator = ? WHERE rowid = ?', update);
				
				Ti.API.info('newConvo = true');
				vacantRow.close();
				db.close();
			}
		//if present, update the row
		else 
			{
				//see if any MainWindow UI changes are necessary
				var localConvoState = db.execute('SELECT happening_status FROM V1_bubbles WHERE rowid = ?', row.fieldByName('rowid'));
				
				if (localConvoState.fieldByName('happening_status') != thisConvo.status)
				{
					
				}
				
				
				Ti.API.info('updateConvo = true');
				//updateUI = true;
				localConvoState.close();
				db.close();
			}
		
		row.close();
	}
	
	//Ti.App.fireEvent('app:buildBubblesView');
}
