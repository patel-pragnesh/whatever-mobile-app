/**
 * The card window
 * 
 * @param {Object} args
 * @param {Object} callback
 */


exports.showCard = function(args)
	{
	
	//this will be controlled by a paramter passed in by MainWindow telling it whether a user's own bubView was clicked or another users'
	var ownCard = false;  
	
	
	
	var bubbleCard = Ti.UI.createView({
		width: '95%',
		height: '99%',
		bottom: '1%',
		backgroundColor: 'black',
		//viewShadowColor: 'black',
		borderRadius: 10
		});
	bubbleCard.hide();
	
	
	
	bubbleCard.addEventListener('click', function(e)
		{
			bubbleCard.hide();
		}
	);
	
	
	var cardScrollView = Ti.UI.createScrollView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		backgroundColor: 'white',
		
	});
	
	var cardScrollViewContainer = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2000,
		
		
	});
	
	if (ownCard){
		cardScrollViewContainer.backgroundColor = 'blue';
		
	} else {
		cardScrollViewContainer.backgroundColor = 'green';
		
	}
	
	
	cardScrollView.add(cardScrollViewContainer);
	bubbleCard.add(cardScrollView);
	return bubbleCard;
	};
	
