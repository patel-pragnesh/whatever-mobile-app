/**
 * @author Cole Halverson
 */

var config = require('config');
var purple = config.purple;
			
function BubViewConstructor(winHeight, winWidth, parentView, conversation)  
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
			
			var convoKey = conversation.conversationId;
			var createdBy = conversation.created_by;
			var newInfo = conversation.new_info;
			var inOut = conversation.in_out;
			
			
			
			var bubView = Ti.UI.createView({
				width: bubViewWidth,
				height: bubViewHeight,
				top: bubViewTop,
				bubConvoKey: convoKey
			});
			
	//event listeners for the bubView
	Ti.App.addEventListener('app:DeleteBubble:' + convoKey, function(e){
		Ti.API.info('delete event recieved');
		Ti.App.removeEventListener('app:DeleteBubble:' + convoKey, arguments.callee);
		parentView.remove(bubView);
	});
	
	Ti.App.addEventListener('app:UpdateBubble:' + convoKey, function(e){
		
	});
			
	bubView.addEventListener('click', function(e)
	{
		cardArgs = {};
		cardArgs.convoKey = bubConvoKey;
		cardArgs.creator.firstName = '';
		cardArgs.creator.lastName = '';
		cardArgs.creator.userId = '';
		Ti.App.fireEvent('app:PopCardView', cardArgs);
	});
			
		//position the bubView
			if (bubPosition == 'left')
			{
				bubView.left = '2%';
			}
			else if (bubPosition == 'right')
			{
				bubView.right = '2%';
			}
			
			var mask = Ti.UI.createImageView
				({				
				image: '/images/joe',						//not sure where to put this to pull it from  //prolly the filesystem
				borderRadius: bubRadius,
				borderColor: 'white',
				borderWidth: bubBorder,
				width: bubDiameter,
				height: bubDiameter,
				top: bubTopBottom,
				botton: bubTopBottom,
				right: bubLeftRight,
				left:  bubLeftRight,
				});
				
			bubView.add(mask);
			
			
			if(conversation.status == 'OPEN')
			{
				itsOpen();
			}else{
				itsHappening();
			}
			
			
				
			
			function itsOpen()
			{
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
			
			
			function itsHappening()
			{
				mask.borderWidth = bubBorder;
			}
			
			
			var bubShadeMask = Ti.UI.createImageView
			({
				backgroundColor: 'black',
				opacity: 0.45,
				width: Titanium.UI.FILL,
				height: '35%',
				bottom: 0
			});
			
			mask.add(bubShadeMask);	
			
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
			bubView.add(commentIndicator);
			
			var imInIndicator = Ti.UI.createImageView({
				image: '/images/imInIndicator',
				top: '24%',
				right: 0,
				height: '20.5%',
				width: '19.2%',
				zIndex: bubbleAttribute
			});
			bubView.add(imInIndicator);
		
		bubView.add(mask);	
		
		return bubView;
	};
	
module.exports = BubViewConstructor;