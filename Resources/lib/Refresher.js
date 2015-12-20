/**
 * @author Cole Halverson
 */

function Refresh()
{
	//Go get userConversations from App Engine
	
	var account = Ti.App.Properties.getObject('account');
	var url = '/v1/conversation?userId=' + account.id;
	
	httpClient.doGet(url, function(success, response)
	{
		if (success)
		{
			UpdateDB(response);
		}
		else
		{
			Ti.API.info('error doGet');
		}
	});		
	
}

function UpdateDB(response)
{
	var db = Ti.Database.open(dbName);
	
	Ti.API.info(response);
}
