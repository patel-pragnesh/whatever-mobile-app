
var config = require('config');
var refreshUtility = require('lib/RefreshUtility');
var httpClient = require('lib/HttpClient');

var purple = config.purple;

var mainWindow = require('ui/common/MainWindow');

var winHeight = mainWindow.winHeight;
var winWidth = mainWindow.winWidth;

function BubblesView()
{
	var bubblesView = Ti.UI.createView
	({
			layout: 'absolute',
			height: 2000,  //Titanium.UI.SIZE
			width: '100%',
			top: 0,
			backgroundColor: 'orange'
	});	
		
	
	
		
	bubblesView.addEventListener('postlayout', function(e){
		this.removeEventListener('postlayout', arguments.callee);
		Ti.API.info('bubblesView post layout');
		Refresh();
	});	
		
	
	
	return bubblesView;
}

module.exports = BubblesView;

Ti.App.addEventListener('app:refresh', function(e)
{
	Refresh();
});

function Refresh()
	{
	Ti.API.info('bubbles view refresh called');
	var account = Ti.App.Properties.getObject('account');
	var url = '/v1/conversation?userId=' + account.id;
	
	httpClient.doGet(url, function(success, response)
	{
		if (success)
		{
			Ti.API.info('bubbles View checkDeletes');
			refreshUtility.checkDeletes(response, function(toDelete)
			{
				//call to delete bubView for each convo in toDelete
				for (i = 0; i < toDelete.length; i++)
				{
					Ti.API.info('BubblesView will delete: ' + toDelete[i]);
				}
			});
			
			refreshUtility.updateDB(response, function(uiArgs)
			{
				for (j = 0; j < uiArgs.length; j++)
				{
					Ti.API.info('BubblesView will update or create: ' + uiArgs[i]);
				}
			});
		}
		else
		{
			Ti.API.info('error doGet for userConversations');
		}
	});		
	
	}	

function layoutBubbles(conversations)
	{
		
		
		for (i = 0; i < conversations.length; i++)
		{
			var bubView = new constructBubble(winHeight, winWidth, conversations[i]) ;
			
			if (i == (conversations.length - 1))   //Add extra space below last bubView being added to accomidate the whatever button
			{
				bubView.bottom = 200;
			}
	
			scrollViewContainer.add(bubView);	
			bubView.fireEvent('animate', {});
		}	
		
		if (scrollViewContainer.size.height < scrollView.size.height)
		{
			scrollViewContainer.height = scrollView.size.height + 10;
		}
		if (scrollViewContainer.size.height > 1500)
		{
			scrollView.showVerticalScrollIndicator = true;
		}
	}
	
	
	function constructBubble(winHeight, winWidth, conversation)  
		{
			var bubbleAttribute = 2;
			
			//check if iphone 4s aspect ratio
			if (winHeight / winWidth == 1.5){
				var bubViewHeight = winHeight * .255;
				var bubViewWidth = winWidth * .421; 
				
				var bubDiameter = bubViewHeight * .932;
				var bubLeftRight = bubViewWidth * .064; 
				var bubTopBottom = bubViewHeight * .034;
				var bubRadius = bubDiameter / 2;
				var bubBorder = bubDiameter *.025;
				var buttonBottom = winHeight * .02;
			} else {
				var bubViewHeight = winHeight * .221;
				var bubViewWidth = winWidth * .421;
				
				var bubDiameter = bubViewHeight * .932;
				var bubLeftRight = bubViewWidth * .064; 
				var bubTopBottom = bubViewHeight * .034;
				var bubRadius = bubDiameter / 2;
				var bubBorder = bubDiameter *.025;
				var buttonBottom = winHeight * .032;
			
			}
			
				
				
			var bubViewTop = conversation.top_y * bubViewHeight;               //get from DB 
			var bubPosition = conversation.position;
			
			var convoKey = conversation.convo_key;
			var createdBy = conversation.created_by;
			var newInfo = conversation.new_info;
			var inOut = conversation.in_out;
			var hapStatus = conversation.happening_status;
			
			
			var bubView = Ti.UI.createView({
				width: bubViewWidth,
				height: bubViewHeight,
				top: bubViewTop,                  //set to bubViewTop
				
				
				//opacity: formDB,    based off time since activity
			});
			
			bubView.special = convoKey;
			
			bubView.addEventListener('click', function(e)
			{
				popBubbleCard(bubView.special);
			});
			
			if (bubPosition == 'left')
			{
				bubView.left = '2%';
			}
			if (bubPosition == 'right')
			{
				bubView.right = '2%';
			}
			
			
			
			var mask = Ti.UI.createImageView({				
				image: '/images/joe',						//not sure where to put this to pull it from  //prolly the filesystem
				borderRadius: bubRadius,
				borderColor: 'white',
				width: bubDiameter,
				height: bubDiameter,
				top: bubTopBottom,
				botton: bubTopBottom,
				right: bubLeftRight,
				left:  bubLeftRight,
				
			});
			
			
			
			if (hapStatus == 'happening')
			{
				mask.borderWidth = bubBorder;
				
			}else{
				mask.borderColor = purple;		
				var spinnerView = Ti.UI.createView({
					height: Ti.UI.SIZE,
					width: Ti.UI.SIZE
				});
				var spinner = Ti.UI.createImageView({
					image: '/images/spinMask',
					height: bubDiameter + 10,
					width: bubDiameter + 10
				});
				spinnerView.add(spinner);
				bubView.add(spinner);
			
			var t = Ti.UI.create2DMatrix();	
					
			function startRotate()											
			{		
					var a = Titanium.UI.createAnimation();
					t = t.rotate(7);
					a.transform = t;
					a.duration = 50;
					
					a.addEventListener('complete', startRotate);
				
					spinner.animate(a);
			}
			
				
				bubView.addEventListener('animate', function(e){
					Ti.API.info('animate');
					startRotate();
				});			
				
			}
			
			
			var bubShadeMask = Ti.UI.createImageView({
				
				backgroundColor: 'black',
				opacity: 0.45,
				width: Titanium.UI.FILL,
				height: '35%',
				bottom: 0
			});
			
			var fontSize = bubDiameter * .094;
			
			var name = Ti.UI.createLabel({
				color: 'white',
				font: {fontSize:fontSize,
					   fontFamily: 'OpenSans-Semibold'},
				text: createdBy,								//fromDB
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				bottom: '18%',
				width: Ti.UI.SIZE, 
				height: Ti.UI.SIZE,
				zIndex: 3,
				opacity: 1.0,
			});
				
			mask.add(name);
			
			var commentIndicator = Ti.UI.createImageView({
				image: '/images/commentIndicatorBlue',
				top: '2%',
				right: '14%',
				height: '20.5%',
				width: '19.2%',
				zIndex: bubbleAttribute,
				
			});
			var imInIndicator = Ti.UI.createImageView({
				image: '/images/imInIndicator',
				top: '24%',
				right: 0,
				height: '20.5%',
				width: '19.2%',
				zIndex: bubbleAttribute
			});
		mask.add(bubShadeMask);	
		bubView.add(mask);	
		
		if (newInfo == 'true')
		{
			bubView.add(commentIndicator);
		}
		
		if (inOut == 'true')
		{
			bubView.add(imInIndicator);
		}
		
	
		return bubView;
	};

