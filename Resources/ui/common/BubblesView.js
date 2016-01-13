


function BubblesView(winHeight, winWidth)
{
	
	var config = require('config');
	var refreshUtility = require('lib/RefreshUtility');
	var httpClient = require('lib/HttpClient');
	var constructBubble = require('ui/common/BubViewConstructor');
	
	var purple = config.purple;
	
	var bubblesView = Ti.UI.createView
	({
			layout: 'absolute',
			height: Titanium.UI.SIZE,
			width: '100%',
			top: 0,
			backgroundColor: purple
	});	
	
		
	bubblesView.addEventListener('postlayout', function(e){
		this.removeEventListener('postlayout', arguments.callee);
		Refresh();
	});	

	
	Ti.App.addEventListener('app:refresh', function(e){
		Refresh();
	});
	
	function Refresh()
	{
	
	var account = Ti.App.Properties.getObject('account');
	var url = '/v1/conversation?userId=' + account.id;
	
	httpClient.doGet(url, function(success, response)
	{
		if (success)
		{
			Ti.API.info(response);
			var deletes = [];
			Ti.API.info('bubbles View checkDeletes');
			refreshUtility.checkDeletes(response, function(deletesExist, toDelete)
			{
				if(deletesExist)
				{
					deletes = toDelete;
				}
			});
			
			refreshUtility.updateDB(response);
		
			refreshUtility.doDeletesFromDB(deletes);
		}
		else
		{
			Ti.API.info('error doGet for userConversations');
		}
	});		
	
	}	
	
	
	Ti.App.addEventListener('app:ConstructBubble', function(e)
	{
		var bubView = new constructBubble(winHeight, winWidth, bubblesView, e) ;
			
			bubblesView.add(bubView);	
			bubView.fireEvent('animate');
		
	});
	
	
	return bubblesView;
};

module.exports = BubblesView;





	
	
	

