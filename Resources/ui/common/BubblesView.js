


function BubblesView(winHeight, winWidth)
{
	
	var config = require('config');
	var refreshUtility = require('lib/RefreshUtility');
	var httpClient = require('lib/HttpClient');
	var constructBubble = require('ui/common/BubViewConstructor');
	
	var purple = config.purple;
	
	var bubblesViewHolder = Ti.UI.createView({
		layout: 'vertical',
		width: '100%',
		height: Ti.UI.SIZE,
		top: 0
	});
	
	var bubblesView = Ti.UI.createView
	({
			layout: 'absolute',
			height: Titanium.UI.SIZE,
			width: '100%',
			top: 5,
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
			
			var deletes = [];
			
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
			alert(error);
		}
	});		
	
	}	
	
	
	Ti.App.addEventListener('app:ConstructBubble', function(e)
	{
		var bubView = new constructBubble(winHeight, winWidth, bubblesView, e) ;
			
		bubblesView.add(bubView);
		
	});
	
	var bottomPadding = Ti.UI.createView({
		top: 0,
		width: '100%',
		height: 150,
		backgroundColor: purple
	});
	
	bubblesViewHolder.add(bubblesView);
	bubblesViewHolder.add(bottomPadding);
	return bubblesViewHolder;
};

module.exports = BubblesView;





	
	
	

